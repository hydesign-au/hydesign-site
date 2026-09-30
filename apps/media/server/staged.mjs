// Lefthook entrypoint for staged media files. It enforces the repo's still-image
// shape, removes GPS, rejects HDR input, then reconciles library.json and
// media.gen.ts.

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

import { listLibrary, regenerate } from "./library.mjs";
import { normalizeJpegOrientation, stripJpegGps } from "./normalize.mjs";
import { closeExifTool, isHdrImage } from "./probe.mjs";

const PHOTO_EXT = ".jpeg";
const VIDEO_EXTS = new Set([".mp4", ".webm"]);
const BLOCKED_EXTS = new Map([
  [".jpg", "rename the file to .jpeg before committing"],
  [".png", "export a JPEG before committing"],
  [".heic", "export and tone-map to SDR JPEG before committing"],
  [".heif", "export and tone-map to SDR JPEG before committing"],
  [".avif", "export and tone-map to SDR JPEG before committing"],
  [".jxl", "export and tone-map to SDR JPEG before committing"],
  [".hdr", "tone-map externally to SDR JPEG before committing"],
  [".exr", "tone-map externally to SDR JPEG before committing"],
  [".tif", "export a JPEG before committing"],
  [".tiff", "export a JPEG before committing"],
]);

const staged = process.argv
  .slice(2)
  .flatMap((arg) => arg.split(/\s+/))
  .filter(Boolean);
const mediaPaths = staged.filter((file) => normalizePath(file).startsWith("media/"));

if (mediaPaths.length > 0) {
  await run(mediaPaths);
}

async function run(files) {
  try {
    await validateMediaPaths(files);
    await listLibrary({ refreshFiles: true });
    regenerate();
    execFileSync("git", ["add", "-A", "--", "media", "apps/web/src/content/media.gen.ts"], {
      stdio: "inherit",
    });
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  } finally {
    await closeExifTool();
  }
}

async function validateMediaPaths(files) {
  const errors = [];

  for (const file of files) {
    const normalized = normalizePath(file);
    const parsed = path.posix.parse(normalized);
    if (!parsed.dir.startsWith("media")) {
      errors.push(`${normalized}: media files must live under media/`);
      continue;
    }

    if (parsed.base === "library.json" || parsed.base.startsWith(".")) continue;

    const ext = parsed.ext.toLowerCase();
    const blocked = BLOCKED_EXTS.get(ext);
    if (blocked) {
      errors.push(`${normalized}: ${blocked}`);
      continue;
    }

    if (ext === PHOTO_EXT) {
      if (existsSync(normalized)) {
        await normalizeJpegOrientation(normalized);
        await stripJpegGps(normalized);
        const hdr = await isHdrImage(normalized);
        if (hdr.detected) {
          errors.push(`${normalized}: HDR detected (${hdr.reasons.join("; ")})`);
        }
      }
      continue;
    }

    if (VIDEO_EXTS.has(ext)) continue;

    errors.push(`${normalized}: media/ accepts .jpeg photos and .mp4/.webm videos`);
  }

  if (errors.length > 0) {
    throw new Error(`media staging problems:\n  ${errors.join("\n  ")}`);
  }
}

function normalizePath(file) {
  return file.replaceAll("\\", "/").replace(/^\.\//, "");
}
