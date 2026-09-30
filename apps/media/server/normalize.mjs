import { execFileSync } from "node:child_process";
import { existsSync, renameSync, rmSync } from "node:fs";

import { exiftool } from "exiftool-vendored";

const ORIENTATION_TRANSFORMS = new Map([
  [2, ["-flip", "horizontal"]],
  [3, ["-rotate", "180"]],
  [4, ["-flip", "vertical"]],
  [5, ["-transpose"]],
  [6, ["-rotate", "90"]],
  [7, ["-transverse"]],
  [8, ["-rotate", "270"]],
]);

export async function jpegOrientation(absPath) {
  const tags = await exiftool.read(absPath);
  return orientationNumber(tags.Orientation);
}

export async function normalizeJpegOrientation(absPath) {
  const orientation = await jpegOrientation(absPath);
  const transform = ORIENTATION_TRANSFORMS.get(orientation);
  if (!transform) return { changed: false, orientation };

  const out = `${absPath}.orienting`;
  try {
    execFileSync("jpegtran", ["-copy", "all", "-perfect", ...transform, "-outfile", out, absPath], {
      stdio: "pipe",
    });
    renameSync(out, absPath);
    await exiftool.write(absPath, { "Orientation#": 1 }, { writeArgs: ["-overwrite_original"] });
    return { changed: true, orientation };
  } catch (err) {
    if (existsSync(out)) rmSync(out, { force: true });
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(
      `${absPath}: could not losslessly normalize EXIF Orientation ${orientation}: ${detail}`,
      { cause: err },
    );
  }
}

// Committed photos are public, so they carry no GPS. The location label in
// library.json is written by hand and does not depend on it.
export async function stripJpegGps(absPath) {
  const tags = await exiftool.read(absPath);
  if (!Object.keys(tags).some((key) => key.startsWith("GPS"))) return { changed: false };
  await exiftool.write(absPath, {}, { writeArgs: ["-gps:all=", "-overwrite_original"] });
  return { changed: true };
}

function orientationNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = String(value ?? "");
  if (!text || text === "Horizontal (normal)") return 1;
  const direct = Number(text);
  if (Number.isFinite(direct)) return direct;
  if (/rotate 180/i.test(text)) return 3;
  if (/rotate 90 cw/i.test(text)) return 6;
  if (/rotate 270 cw|rotate 90 ccw/i.test(text)) return 8;
  return 1;
}
