import path from "node:path";

const IMAGE_RE = /\.jpeg$/i;
const VIDEO_RE = /\.(mp4|webm)$/i;

export function groupMediaFiles(files) {
  const groups = new Map();
  for (const file of files) {
    const stem = path.posix.basename(file).replace(/\.[^.]+$/, "");
    const group = groups.get(stem) ?? { id: stem, photo: null, video: null };
    if (IMAGE_RE.test(file)) {
      if (group.photo) throw new Error(`duplicate media id "${stem}": ${group.photo}, ${file}`);
      group.photo = file;
    } else if (VIDEO_RE.test(file)) {
      if (group.video) throw new Error(`duplicate media id "${stem}": ${group.video}, ${file}`);
      group.video = file;
    }
    groups.set(stem, group);
  }
  return [...groups.values()].toSorted((a, b) => a.id.localeCompare(b.id));
}

export function photoPath(file, capturedAt) {
  const match = typeof capturedAt === "string" ? /^(\d{4})-(\d{2})/.exec(capturedAt) : null;
  const directory = match ? `${match[1]}/${match[2]}` : "dump";
  return `${directory}/${path.posix.basename(file)}`;
}

export function videoPath(file) {
  return `videos/${path.posix.basename(file)}`;
}

export function isMediaFile(file) {
  return IMAGE_RE.test(file) || VIDEO_RE.test(file);
}
