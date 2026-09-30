import { Card, CardContent } from "@hydesign/ui/components/card";

import type { ExifData, GpsPoint, MediaItem } from "@/api";

// The read-only capture facts, plus an OpenStreetMap embed when the shot is geotagged.
export function ExifPanel({ item }: { item: MediaItem }) {
  const exif = item.exif;
  const gps = validGps(exif?.gps);

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm font-medium">File</div>
      <Card className="gap-0 py-0 shadow-none">
        <CardContent className="grid gap-2 p-3 text-xs">
          <Row label="File size" value={formatBytes(item.bytes)} />
        </CardContent>
      </Card>

      {item.type === "photo" ? (
        <>
          <div className="text-sm font-medium">Capture</div>
          <Card className="gap-0 py-0 shadow-none">
            <CardContent className="grid gap-2 p-3 text-xs">
              <Row label="Captured" value={formatDate(item.capturedAt)} />
              <Row label="Camera" value={joinTruthy(exif?.cameraMake, exif?.cameraModel)} />
              <Row label="Lens" value={exif?.lensModel} />
              <Row label="Exposure" value={exif?.shutterSpeed} />
              <Row label="Aperture" value={numberish(exif?.aperture)} />
              <Row label="ISO" value={numberish(exif?.iso)} />
              <Row label="Focal length" value={numberish(exif?.focalLength)} />
              <Row label="Dimensions" value={dimensions(exif)} />
              <Row label="Range" value={dynamicRange(exif)} />
              <Row label="GPS" value={gps ? gpsLabel(gps) : undefined} />
            </CardContent>
          </Card>
        </>
      ) : null}

      {item.type === "photo" && gps ? (
        <Card className="gap-0 overflow-hidden py-0 shadow-none">
          <CardContent className="p-0">
            <iframe
              title={`Map for ${gpsLabel(gps)}`}
              src={osmEmbedUrl(gps.latitude, gps.longitude)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts"
              className="h-56 w-full border-0"
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-3">
      <div className="text-muted-foreground">{label}</div>
      <div className="min-w-0 truncate">{value || "—"}</div>
    </div>
  );
}

type ValidGps = { latitude: number; longitude: number; altitude: number | null };

function validGps(point?: GpsPoint | null): ValidGps | null {
  const { latitude, longitude } = point ?? {};
  if (typeof latitude !== "number" || typeof longitude !== "number") return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
  if (latitude === 0 && longitude === 0) return null;
  const altitude =
    typeof point?.altitude === "number" && Number.isFinite(point.altitude) ? point.altitude : null;
  return { latitude, longitude, altitude };
}

function gpsLabel(point: ValidGps) {
  const coords = `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;
  return point.altitude === null ? coords : `${coords}, ${Math.round(point.altitude)}m`;
}

function osmEmbedUrl(latitude: number, longitude: number) {
  const delta = 0.01;
  const bbox = [longitude - delta, latitude - delta, longitude + delta, latitude + delta].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox,
  )}&layer=mapnik&marker=${encodeURIComponent(`${latitude},${longitude}`)}`;
}

function dimensions(exif?: ExifData | null) {
  const size = exif?.dimensions;
  return size?.width && size?.height ? `${size.width}x${size.height}` : undefined;
}

function dynamicRange(exif?: ExifData | null) {
  if (!exif?.hdr?.detected) return undefined;
  return exif.hdr.reasons.length ? `HDR (${exif.hdr.reasons[0]})` : "HDR";
}

function joinTruthy(...parts: (string | null | undefined)[]) {
  return parts.filter(Boolean).join(" ") || undefined;
}

function numberish(value?: number | null) {
  return value === null || value === undefined ? undefined : String(value);
}

function formatDate(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    date,
  );
}

function formatBytes(bytes: number) {
  if (!bytes) return undefined;
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${unit === 0 || value >= 10 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
}
