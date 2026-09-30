const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function createFolder(library, { label, parent = null }) {
  const cleanLabel = requireLabel(label);
  const slug = slugify(cleanLabel);
  const folders = requireFolders(library);
  if (folders[slug]) throw new Error(`folder "${slug}" already exists`);
  if (parent && !folders[parent]) throw new Error(`unknown parent folder "${String(parent)}"`);

  folders[slug] = parent ? { label: cleanLabel, parent } : { label: cleanLabel };
  validateFolderTree(folders);
  return slug;
}

export function renameFolder(library, slug, label) {
  const folders = requireFolders(library);
  const current = folders[slug];
  if (!current) throw new Error(`no folder "${slug}"`);

  const cleanLabel = requireLabel(label);
  const nextSlug = slugify(cleanLabel);
  if (nextSlug !== slug && folders[nextSlug])
    throw new Error(`folder "${nextSlug}" already exists`);

  if (nextSlug === slug) {
    current.label = cleanLabel;
    return slug;
  }

  folders[nextSlug] = { ...current, label: cleanLabel };
  delete folders[slug];
  for (const folder of Object.values(folders)) {
    if (folder.parent === slug) folder.parent = nextSlug;
  }
  for (const item of Object.values(library.items ?? {})) {
    item.folders = uniqueStrings(item.folders).map((value) => (value === slug ? nextSlug : value));
  }
  validateFolderTree(folders);
  return nextSlug;
}

export function deleteFolder(library, slug) {
  const folders = requireFolders(library);
  if (!folders[slug]) throw new Error(`no folder "${slug}"`);

  const removed = descendantsOf(folders, slug);
  const removedSet = new Set(removed);
  for (const value of removed) delete folders[value];
  for (const item of Object.values(library.items ?? {})) {
    item.folders = uniqueStrings(item.folders).filter((value) => !removedSet.has(value));
  }
  return removed;
}

export function folderOptions(folders) {
  validateFolderTree(folders);
  const children = childMap(folders);
  const result = [];

  function visit(slug, depth, ancestors) {
    const folder = folders[slug];
    const path = [...ancestors, folder.label];
    result.push({
      slug,
      label: folder.label,
      parent: folder.parent ?? null,
      depth,
      path: path.join(" / "),
    });
    for (const child of children.get(slug) ?? []) visit(child, depth + 1, path);
  }

  for (const root of children.get(null) ?? []) visit(root, 0, []);
  return result;
}

export function validateFolderAssignments(values, folders, itemId = "media") {
  const clean = uniqueStrings(values);
  for (const slug of clean) {
    if (!folders[slug]) throw new Error(`${itemId}: unknown folder "${slug}"`);
  }
  return clean;
}

export function validateFolderTree(folders) {
  if (!folders || typeof folders !== "object" || Array.isArray(folders)) {
    throw new Error("library folders must be an object");
  }

  for (const [slug, folder] of Object.entries(folders)) {
    if (!SLUG_RE.test(slug)) throw new Error(`invalid folder slug "${slug}"`);
    if (!folder || typeof folder !== "object" || Array.isArray(folder)) {
      throw new Error(`folder "${slug}" must be an object`);
    }
    requireLabel(folder.label);
    if (folder.parent && !folders[folder.parent]) {
      throw new Error(`folder "${slug}" has unknown parent "${folder.parent}"`);
    }
  }

  for (const slug of Object.keys(folders)) {
    const seen = new Set([slug]);
    let parent = folders[slug].parent;
    while (parent) {
      if (seen.has(parent)) throw new Error(`folder cycle at "${parent}"`);
      seen.add(parent);
      parent = folders[parent]?.parent;
    }
  }
}

export function slugify(label) {
  const slug = requireLabel(label)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!SLUG_RE.test(slug)) throw new Error(`cannot make a folder slug from "${label}"`);
  return slug;
}

function descendantsOf(folders, root) {
  const children = childMap(folders);
  const result = [];
  function visit(slug) {
    result.push(slug);
    for (const child of children.get(slug) ?? []) visit(child);
  }
  visit(root);
  return result;
}

function childMap(folders) {
  const result = new Map();
  for (const [slug, folder] of Object.entries(folders)) {
    const parent = folder.parent ?? null;
    const entries = result.get(parent) ?? [];
    entries.push(slug);
    result.set(parent, entries);
  }
  for (const entries of result.values()) {
    entries.sort((a, b) => folders[a].label.localeCompare(folders[b].label));
  }
  return result;
}

function requireFolders(library) {
  if (!library.folders || typeof library.folders !== "object" || Array.isArray(library.folders)) {
    throw new Error("library folders must be an object");
  }
  return library.folders;
}

function requireLabel(label) {
  const text = typeof label === "string" ? label.trim() : "";
  if (!text) throw new Error("a folder name is required");
  return text;
}

function uniqueStrings(values) {
  return Array.isArray(values)
    ? [...new Set(values.filter((value) => typeof value === "string"))]
    : [];
}
