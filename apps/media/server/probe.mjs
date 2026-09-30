// Reading pixels and EXIF off a file. sharp gives image dimensions; exiftool
// gives EXIF and video dimensions; a dependency-free JPEG/PNG header parse is the
// fallback when sharp can't decode. Nothing here writes — it only reads.

import { closeSync, openSync, readSync, statSync } from "node:fs";

import { exiftool } from "exiftool-vendored";
import sharp from "sharp";

export async function imageDimensions(absPath) {
  try {
    const { autoOrient, width, height } = await sharp(absPath).metadata();
    const orientedWidth = autoOrient?.width ?? width;
    const orientedHeight = autoOrient?.height ?? height;
    return { width: numberOrNull(orientedWidth), height: numberOrNull(orientedHeight) };
  } catch {
    const dims = headerDimensions(absPath);
    return { width: dims.width || null, height: dims.height || null };
  }
}

export async function videoDimensions(absPath) {
  const tags = await readTags(absPath);
  return {
    width: numberOrNull(tags.ImageWidth ?? tags.SourceImageWidth),
    height: numberOrNull(tags.ImageHeight ?? tags.SourceImageHeight),
    durationSeconds: secondsFromDuration(tags.Duration),
  };
}

// The EXIF the manager uses: capture time, camera, exposure, GPS, dimensions,
// and HDR signals. The web generator intentionally does not expose it.
export async function readExif(absPath, dimensions) {
  const tags = await readTags(absPath);
  const hdr = hdrInfo(tags);
  const exif = {
    capturedAt: exifDate(tags.DateTimeOriginal ?? tags.CreateDate ?? tags.ModifyDate),
    cameraMake: stringOrNull(tags.Make),
    cameraModel: stringOrNull(tags.Model),
    lensModel: stringOrNull(tags.LensModel),
    focalLength: numberOrNull(tags.FocalLength),
    aperture: numberOrNull(tags.FNumber ?? tags.ApertureValue),
    shutterSpeed: shutterLabel(tags.ExposureTime ?? tags.ShutterSpeedValue),
    iso: numberOrNull(tags.ISO),
    dimensions,
    gps: validGps(tags.GPSLatitude, tags.GPSLongitude, tags.GPSAltitude),
  };
  if (hdr.detected) exif.hdr = hdr;
  return exif;
}

export async function isHdrImage(absPath) {
  const tags = await readTags(absPath);
  return hdrInfo(tags);
}

export async function closeExifTool() {
  await exiftool.end();
}

async function readTags(absPath) {
  try {
    return await exiftool.read(absPath);
  } catch {
    return {};
  }
}

// JPEG dimensions sit in the SOF marker after the EXIF segment; 256 KB of header
// covers it, PNG needs 24 bytes.
function headerDimensions(absPath) {
  const bytes = statSync(absPath).size;
  const fd = openSync(absPath, "r");
  try {
    const buf = Buffer.alloc(Math.min(256 * 1024, bytes));
    readSync(fd, buf, 0, buf.length, 0);
    const dims = pngSize(buf) ?? jpegSize(buf);
    return { width: dims?.width ?? 0, height: dims?.height ?? 0 };
  } finally {
    closeSync(fd);
  }
}

function pngSize(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function jpegSize(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let off = 2;
  while (off + 9 < buf.length) {
    if (buf[off] !== 0xff) {
      off++;
      continue;
    }
    let marker = buf[off + 1];
    while (marker === 0xff && off + 2 < buf.length) {
      off++;
      marker = buf[off + 1];
    }
    off += 2;
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      if (off + 7 > buf.length) return null;
      return { height: buf.readUInt16BE(off + 3), width: buf.readUInt16BE(off + 5) };
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) continue;
    if (off + 2 > buf.length) return null;
    off += buf.readUInt16BE(off);
  }
  return null;
}

function numberOrNull(value) {
  if (value && typeof value === "object" && "toFloat" in value) return value.toFloat();
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function stringOrNull(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function hdrInfo(tags) {
  const reasons = [];
  for (const [key, value] of Object.entries(tags)) {
    if (value === undefined || value === null || value === "") continue;
    if (/\b(HDR|GainMap|Gain Map|AuxiliaryImage|DynamicRange)\b/i.test(key)) {
      reasons.push(labelTag(key, value));
      continue;
    }
    if (
      /Color|Profile|Transfer|Primaries|Matrix|Range|Format|Encoding/i.test(key) &&
      /HDR|HLG|PQ|Rec\.?\s*2100|BT\.?\s*2100|SMPTE\s*ST\s*2084|Perceptual\s*Quant/i.test(
        String(value),
      )
    ) {
      reasons.push(labelTag(key, value));
    }
  }

  return { detected: reasons.length > 0, reasons: reasons.toSorted((a, b) => a.localeCompare(b)) };
}

function labelTag(key, value) {
  return `${key}: ${String(value)}`;
}

function exifDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && "toDate" in value) return value.toDate().toISOString();
  const normal = String(value).replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
  const date = new Date(normal);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}

function shutterLabel(value) {
  const seconds = numberOrNull(value);
  if (!seconds) return stringOrNull(value);
  if (seconds < 1) return `1/${Math.round(1 / seconds)}`;
  return `${seconds}s`;
}

function secondsFromDuration(value) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "toFloat" in value) return value.toFloat();
  const text = stringOrNull(value);
  if (!text) return null;
  const direct = Number(text);
  if (Number.isFinite(direct)) return direct;
  const parts = text.split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return null;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

function validGps(latitude, longitude, altitude) {
  const lat = numberOrNull(latitude);
  const lon = numberOrNull(longitude);
  if (lat === null || lon === null) return null;
  if (lat === 0 && lon === 0) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { latitude: lat, longitude: lon, altitude: numberOrNull(altitude) };
}
