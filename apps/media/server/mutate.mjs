// Every write to the library goes through here: edit, bulk-edit, delete,
// and manage the folder tree. Each write updates
// library.json and regenerates the web app's media.gen.ts, so the site's typed
// bindings never drift from the files on disk. Framework-free, so a standalone
// Node/MCP server could reuse it.

import { rmSync } from "node:fs";
import path from "node:path";

import {
  createFolder as createFolderIn,
  deleteFolder as deleteFolderFrom,
  renameFolder as renameFolderIn,
  validateFolderAssignments,
} from "./folders.mjs";
import {
  readLibrary,
  regenerate,
  toClientLibrary,
  toClientItem,
  writeLibrary,
} from "./library.mjs";
import { mediaDir } from "./paths.mjs";

// Edit one item's content fields; returns the updated client item.
export function patchItem(id, patch) {
  const library = readLibrary();
  const entry = library.items[id];
  if (!entry) throw new Error(`no media for "${id}"`);

  applyPatch(entry, patch, library.folders, id);
  library.items[id] = entry;
  writeLibrary(library);
  regenerate();
  return toClientItem(id, entry, path.join(mediaDir, entry.file), library.folders);
}

// Apply one patch across a selection in a single write; all-or-nothing.
export function bulkPatch(ids, patch) {
  const library = readLibrary();
  const updated = [];

  for (const id of ids) {
    const entry = library.items[id];
    if (!entry) throw new Error(`no media for "${id}"`);
    applyPatch(entry, patch, library.folders, id);
    library.items[id] = entry;
  }

  writeLibrary(library);
  regenerate();
  for (const id of ids) {
    const entry = library.items[id];
    updated.push(toClientItem(id, entry, path.join(mediaDir, entry.file), library.folders));
  }
  return updated;
}

// Delete a selection: each item's file and optional video poster plus its library
// entry. Missing files are skipped, not fatal.
export function deleteItems(ids) {
  const library = readLibrary();

  for (const id of ids) {
    const entry = library.items[id];
    if (entry?.file) rmSync(path.join(mediaDir, entry.file), { force: true });
    if (entry?.poster) rmSync(path.join(mediaDir, entry.poster), { force: true });
    delete library.items[id];
  }

  writeLibrary(library);
  regenerate();
  return { ids };
}

export function createFolder(input) {
  const library = readLibrary();
  const slug = createFolderIn(library, input);
  writeLibrary(library);
  regenerate();
  return { slug, library: toClientLibrary(library) };
}

export function renameFolder(slug, label) {
  const library = readLibrary();
  const nextSlug = renameFolderIn(library, slug, label);
  writeLibrary(library);
  regenerate();
  return { slug: nextSlug, library: toClientLibrary(library) };
}

export function removeFolder(slug) {
  const library = readLibrary();
  const removed = deleteFolderFrom(library, slug);
  writeLibrary(library);
  regenerate();
  return { removed, library: toClientLibrary(library) };
}

function applyPatch(entry, patch, folders, id) {
  if (!patch || typeof patch !== "object") return;
  if (typeof patch.location === "string") entry.location = patch.location.trim();
  if (Array.isArray(patch.folders)) {
    entry.folders = validateFolderAssignments(patch.folders, folders, id);
  }
}
