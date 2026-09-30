// The manager's client for the local /api/media routes (served by server/http.mjs).
// One library payload in, typed mutations out. Every write returns the updated
// resource so callers patch state without a full refetch.

export type MediaFolder = {
  slug: string;
  label: string;
  parent: string | null;
  depth: number;
  path: string;
};

export type Orientation = "landscape" | "portrait";

export type GpsPoint = {
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
};

export type ExifData = {
  capturedAt?: string | null;
  cameraMake?: string | null;
  cameraModel?: string | null;
  lensModel?: string | null;
  focalLength?: number | null;
  aperture?: number | null;
  shutterSpeed?: string | null;
  iso?: number | null;
  dimensions?: { width: number | null; height: number | null } | null;
  gps?: GpsPoint | null;
  hdr?: { detected: boolean; reasons: string[] } | null;
};

export type MediaItem = {
  id: string;
  type: "photo" | "video";
  file: string;
  path: string;
  bytes: number;
  mime: string;
  width: number | null;
  height: number | null;
  orientation: Orientation;
  durationSeconds: number | null;
  posterFile: string | null;
  location: string;
  folders: string[];
  exif: ExifData | null;
  capturedAt: string | null;
  checksum?: string;
};

export type MediaPatch = {
  location?: string;
  folders?: string[];
};

export type MediaLibrary = {
  root: string;
  items: MediaItem[];
  folders: MediaFolder[];
};

type FolderMutation = { slug: string; library: MediaLibrary };

const jsonHeaders = { "content-type": "application/json" };

// Fetch, throwing the server's error message on a non-2xx. Callers read the body
// themselves so the concrete return type stays honest without a cast.
async function send(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(readError(body) ?? `Request failed (${res.status})`);
  }
  return res;
}

export async function fetchLibrary(): Promise<MediaLibrary> {
  return (await send("/api/media/library")).json();
}

export async function patchItem(id: string, patch: MediaPatch): Promise<MediaItem> {
  const res = await send(`/api/media/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify(patch),
  });
  const { item } = await res.json();
  return item;
}

export async function bulkPatch(ids: string[], patch: MediaPatch): Promise<MediaItem[]> {
  const res = await send("/api/media/bulk", {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify({ ids, patch }),
  });
  const { items } = await res.json();
  return items;
}

export async function deleteItems(ids: string[]): Promise<void> {
  await send("/api/media", {
    method: "DELETE",
    headers: jsonHeaders,
    body: JSON.stringify({ ids }),
  });
}

export async function refreshLibrary(): Promise<MediaLibrary> {
  return (await send("/api/media/jobs/refresh", { method: "POST" })).json();
}

export async function createFolder(label: string, parent: string | null): Promise<FolderMutation> {
  const res = await send("/api/media/folders", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ label, parent }),
  });
  return res.json();
}

export async function renameFolder(slug: string, label: string): Promise<FolderMutation> {
  const res = await send(`/api/media/folders/${encodeURIComponent(slug)}`, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify({ label }),
  });
  return res.json();
}

export async function removeFolder(slug: string): Promise<MediaLibrary> {
  const res = await send(`/api/media/folders/${encodeURIComponent(slug)}`, { method: "DELETE" });
  const { library } = await res.json();
  return library;
}

// `version` busts the browser cache after Refresh sees changed bytes behind the same name.
export const mediaUrl = (file: string, version = 0) =>
  `/media/${encodeURIComponent(file)}${version ? `?v=${version}` : ""}`;

function readError(value: unknown) {
  return value && typeof value === "object" && "error" in value && typeof value.error === "string"
    ? value.error
    : undefined;
}
