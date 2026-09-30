import type { MediaFolder, MediaItem } from "@/api";

export type View =
  | { kind: "all" | "photos" | "videos" | "noExif" | "unfiled" }
  | { kind: "folder"; value: string };

export type Sort = "capturedNewest" | "capturedOldest" | "name";

export type LibraryCounts = {
  all: number;
  photos: number;
  videos: number;
  noExif: number;
  unfiled: number;
  folders: Record<string, number>;
};

export function isMissingExif(item: MediaItem) {
  return item.type === "photo" && !item.capturedAt;
}

export function folderScope(folders: MediaFolder[], root: string): Set<string> {
  const result = new Set([root]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const folder of folders) {
      if (folder.parent && result.has(folder.parent) && !result.has(folder.slug)) {
        result.add(folder.slug);
        changed = true;
      }
    }
  }
  return result;
}

export function matchesView(item: MediaItem, view: View, folders: MediaFolder[]): boolean {
  switch (view.kind) {
    case "photos":
      return item.type === "photo";
    case "videos":
      return item.type === "video";
    case "noExif":
      return isMissingExif(item);
    case "unfiled":
      return item.folders.length === 0;
    case "folder": {
      const scope = folderScope(folders, view.value);
      return item.folders.some((slug) => scope.has(slug));
    }
    default:
      return true;
  }
}

export function searchItems(items: MediaItem[], query: string, folders: MediaFolder[]) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return items;
  const bySlug = new Map(folders.map((folder) => [folder.slug, folder]));
  return items.filter((item) => {
    const parts = [
      item.file,
      item.location,
      item.type,
      ...item.folders.flatMap((slug) => [slug, bySlug.get(slug)?.path ?? ""]),
      dateText(item.capturedAt),
    ];
    const haystack = parts.filter(Boolean).join(" ").toLowerCase();
    return tokens.every((token) => haystack.includes(token));
  });
}

export function sortItems(items: MediaItem[], sort: Sort) {
  if (sort === "name") return items.toSorted(byName);
  const direction = sort === "capturedNewest" ? -1 : 1;
  return items.toSorted((a, b) => {
    if (!a.capturedAt && !b.capturedAt) return byName(a, b);
    if (!a.capturedAt) return 1;
    if (!b.capturedAt) return -1;
    return direction * a.capturedAt.localeCompare(b.capturedAt) || byName(a, b);
  });
}

export function counts(items: MediaItem[], folders: MediaFolder[]): LibraryCounts {
  const result: LibraryCounts = {
    all: items.length,
    photos: 0,
    videos: 0,
    noExif: 0,
    unfiled: 0,
    folders: {},
  };

  const scopes = new Map(folders.map((folder) => [folder.slug, folderScope(folders, folder.slug)]));
  for (const item of items) {
    if (item.type === "photo") result.photos += 1;
    else result.videos += 1;
    if (isMissingExif(item)) result.noExif += 1;
    if (item.folders.length === 0) result.unfiled += 1;
    for (const folder of folders) {
      const scope = scopes.get(folder.slug);
      if (scope && item.folders.some((slug) => scope.has(slug))) {
        result.folders[folder.slug] = (result.folders[folder.slug] ?? 0) + 1;
      }
    }
  }
  return result;
}

export function orderedFolders(folders: MediaFolder[], values: string[]) {
  const selected = new Set(values);
  const known = folders.filter((folder) => selected.has(folder.slug)).map(({ slug }) => slug);
  const unknown = values.filter((value) => !known.includes(value));
  return [...known, ...unknown];
}

export function itemTitle(item: MediaItem, folders: MediaFolder[]) {
  return itemProject(item, folders) || item.file.split("/").at(-1) || item.file;
}

export function itemProject(item: MediaItem, folders: MediaFolder[]) {
  const bySlug = new Map(folders.map((folder) => [folder.slug, folder]));
  const project = item.folders
    .map((slug) => bySlug.get(slug))
    .find((folder) => folder?.parent === "projects");
  return project?.label ?? "";
}

function dateText(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-AU", { month: "long", year: "numeric" });
}

function byName(a: MediaItem, b: MediaItem) {
  return a.file.localeCompare(b.file, undefined, { numeric: true });
}
