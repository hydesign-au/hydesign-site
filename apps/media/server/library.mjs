// The library store: one JSON file (media/library.json) is the whole truth.
// Refresh reconciles it with the files on disk — new files get an entry,
// vanished files lose theirs, changed files get re-probed — and builds the
// payload the manager renders. Writes go through mutate.mjs; this module owns the
// read, the scan, and the shared shape helpers.

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import { folderOptions, validateFolderAssignments, validateFolderTree } from "./folders.mjs";
import { generateMedia } from "./generate.mjs";
import { libraryPath, mediaDir } from "./paths.mjs";
import { imageDimensions, readExif, videoDimensions } from "./probe.mjs";
import { groupMediaFiles, isMediaFile, photoPath, videoPath } from "./structure.mjs";

const MIME = {
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

export const contentTypes = MIME;
export const stemOf = (file) => path.posix.basename(file).replace(/\.[^.]+$/, "");

export function readLibrary() {
  if (!existsSync(libraryPath)) {
    return { folders: {}, items: {} };
  }
  const parsed = JSON.parse(readFileSync(libraryPath, "utf8"));
  const library = {
    folders: isObject(parsed.folders) ? parsed.folders : {},
    items: isObject(parsed.items) ? parsed.items : {},
  };
  validateFolderTree(library.folders);
  for (const [id, item] of Object.entries(library.items)) {
    validateFolderAssignments(item.folders, library.folders, id);
  }
  return library;
}

export function writeLibrary(library) {
  validateFolderTree(library.folders);
  for (const [id, item] of Object.entries(library.items)) {
    item.folders = validateFolderAssignments(item.folders, library.folders, id);
  }
  const out = {
    folders: sortKeys(library.folders),
    items: sortKeys(library.items),
  };
  writeFileSync(libraryPath, `${formatLibraryJson(out)}\n`);
}

// Regenerate the web app's media.gen.ts, but only once there's something to
// generate — an empty library would just throw.
export function regenerate() {
  if (Object.keys(readLibrary().items).length) generateMedia();
}

export async function listLibrary({ refreshFiles = false } = {}) {
  const library = readLibrary();
  if (refreshFiles) {
    await refreshInto(library);
    writeLibrary(library);
  }
  return toClientLibrary(library);
}

export function toClientLibrary(library) {
  return {
    root: "media/",
    items: Object.entries(library.items)
      .map(([id, entry]) =>
        toClientItem(id, entry, path.join(mediaDir, entry.file), library.folders),
      )
      .toSorted((a, b) => a.file.localeCompare(b.file)),
    folders: folderOptions(library.folders),
  };
}

// Refresh is the one filesystem boundary: recursively discover files, re-read
// metadata, move photos into capture year/month (or dump), then reconcile JSON.
async function refreshInto(library) {
  const groups = groupMediaFiles(findMediaFiles());
  const seen = new Set();

  for (const group of groups) {
    seen.add(group.id);
    library.items[group.id] = group.video
      ? await refreshVideo(group, library)
      : await refreshPhoto(group, library);
  }

  for (const id of Object.keys(library.items)) {
    if (!seen.has(id)) delete library.items[id];
  }
  removeEmptyDirectories(mediaDir);
}

async function refreshPhoto(group, library) {
  if (!group.photo) throw new Error(`${group.id}: photo file is missing`);
  const source = absoluteMediaPath(group.photo);
  const dims = await imageDimensions(source);
  const exif = await readExif(source, { width: dims.width, height: dims.height });
  const file = photoPath(group.photo, exif.capturedAt);
  const stat = statSync(source);
  const stored = library.items[group.id] ?? {};
  moveMediaFile(group.photo, file);
  return {
    file,
    type: "photo",
    location: stored.location ?? "",
    folders: validateFolderAssignments(stored.folders, library.folders, group.id),
    bytes: stat.size,
    checksum: sha256File(absoluteMediaPath(file)),
    width: dims.width,
    height: dims.height,
    exif,
  };
}

async function refreshVideo(group, library) {
  const source = absoluteMediaPath(group.video);
  const dims = await videoDimensions(source);
  const file = videoPath(group.video);
  const stat = statSync(source);
  const stored = library.items[group.id] ?? {};
  const entry = {
    file,
    type: "video",
    location: stored.location ?? "",
    folders: validateFolderAssignments(stored.folders, library.folders, group.id),
    bytes: stat.size,
    checksum: sha256File(source),
    width: dims.width,
    height: dims.height,
    durationSeconds: dims.durationSeconds ?? null,
  };
  moveMediaFile(group.video, file);
  if (group.photo) {
    entry.poster = videoPath(group.photo);
    moveMediaFile(group.photo, entry.poster);
  }
  return entry;
}

export function toClientItem(id, entry, absPath, folders) {
  const width = entry.width ?? entry.exif?.dimensions?.width ?? null;
  const height = entry.height ?? entry.exif?.dimensions?.height ?? null;
  return {
    id,
    type: entry.type,
    file: entry.file,
    path: `media/${entry.file}`,
    bytes: entry.bytes ?? (absPath ? statSync(absPath).size : 0),
    mime: MIME[path.extname(entry.file).toLowerCase()] ?? "application/octet-stream",
    width,
    height,
    orientation: height && width && height > width ? "portrait" : "landscape",
    durationSeconds: entry.durationSeconds ?? null,
    posterFile: entry.poster ?? null,
    location: entry.location ?? "",
    folders: validateFolderAssignments(entry.folders, folders, id),
    exif: entry.type === "photo" ? (entry.exif ?? null) : null,
    capturedAt: entry.exif?.capturedAt ?? null,
    checksum: entry.checksum,
  };
}

function findMediaFiles(directory = mediaDir) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...findMediaFiles(absolute));
    else {
      const relative = relativeMediaPath(absolute);
      if (isMediaFile(relative)) result.push(relative);
    }
  }
  return result.toSorted((a, b) => a.localeCompare(b));
}

function moveMediaFile(source, target) {
  if (source === target) return;
  const from = absoluteMediaPath(source);
  const to = absoluteMediaPath(target);
  if (existsSync(to)) throw new Error(`${target}: target already exists`);
  mkdirSync(path.dirname(to), { recursive: true });
  renameSync(from, to);
}

function absoluteMediaPath(relative) {
  return path.join(mediaDir, ...relative.split("/"));
}

function relativeMediaPath(absolute) {
  return path.relative(mediaDir, absolute).split(path.sep).join("/");
}

function removeEmptyDirectories(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const child = path.join(directory, entry.name);
    removeEmptyDirectories(child);
    if (readdirSync(child).length === 0) rmdirSync(child);
  }
}

export function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

export function sha256File(absPath) {
  return sha256(readFileSync(absPath));
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sortKeys(items) {
  return Object.fromEntries(Object.entries(items).toSorted(([a], [b]) => a.localeCompare(b)));
}

function formatLibraryJson(value) {
  const json = JSON.stringify(value, null, 2);
  return json.replace(
    /\[\n((?:[ \t]+(?:"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?|true|false|null),?\n)+)([ \t]*)\]/gi,
    (match, body, _indent, offset) => {
      const values = body
        .trim()
        .split("\n")
        .map((line) => line.trim().replace(/,$/, ""));
      const inline = `[${values.join(", ")}]`;
      const lineStart = json.lastIndexOf("\n", offset) + 1;
      return offset - lineStart + inline.length < 100 ? inline : match;
    },
  );
}
