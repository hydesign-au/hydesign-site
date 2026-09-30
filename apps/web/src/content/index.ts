export { folders, images, imageMeta, videoMeta, videos } from "./media.gen";
export type { FolderSlug, ImageKey, MediaMeta, SiteVideo, VideoKey } from "./media.gen";
export { getNavItems, serviceNavItems } from "./nav";
export type { NavItem } from "./nav";
export { buildLlmsText } from "./llms";
export { getProject, projects } from "./projects";
export type { Project } from "./projects";
export { absoluteSiteUrl, publicRoutes } from "./public-routes";
export type { PublicRoute } from "./public-routes";
export { customerReviews } from "./reviews";
export type { CustomerReview, CustomerReviewsData } from "./reviews";
export { getService, homepageServices, serviceHref, services } from "./services";
export type { PhotoGroup, Service } from "./services/types";
export { siteSettings } from "./site";

import {
  folders,
  folderSlugs,
  imageKeys,
  imageMeta,
  type FolderSlug,
  type ImageKey,
  type MediaMeta,
} from "./media.gen";
import { serviceCatalog } from "./services/catalog";

const serviceTitleBySlug = new Map(serviceCatalog.map((service) => [service.slug, service.title]));

export function imageAlt(key: ImageKey): string {
  const meta = imageMeta[key];
  const subject = [projectLabel(meta), meta.location].filter(Boolean).join(", ");
  const services = serviceLabels(meta);
  const service = services.length > 1 ? "Signage" : services[0];
  if (!service) return subject;
  return subject ? `${service} for ${subject}` : service;
}

export function imageLabel(key: ImageKey): string {
  return projectLabel(imageMeta[key]) || imageMeta[key].location || key;
}

export function galleryImagesByFolder(
  slug: FolderSlug,
  options: { includeChildren?: boolean } = {},
): ImageKey[] {
  const scope = folderScope(slug, options.includeChildren ?? false);
  return imageKeys.filter((key) => imageMeta[key].folders.some((folder) => scope.has(folder)));
}

export function serviceSlugsForImages(keys: ImageKey[]): string[] {
  return [
    ...new Set(
      keys.flatMap((key) =>
        imageMeta[key].folders.flatMap((slug) => folderAncestors(slug)).filter(isServiceFolder),
      ),
    ),
  ];
}

export function galleryImages(): ImageKey[] {
  return galleryImagesByFolder("gallery");
}

function projectLabel(meta: MediaMeta) {
  const folder = meta.folders
    .map((slug) => folders[slug])
    .find((entry) => entry.parent === "projects");
  return folder?.label ?? "";
}

function serviceLabels(meta: MediaMeta) {
  return [
    ...new Set(
      meta.folders
        .flatMap((slug) => folderAncestors(slug))
        .map((slug) => serviceTitleBySlug.get(slug))
        .filter((label): label is string => Boolean(label)),
    ),
  ];
}

function isServiceFolder(slug: FolderSlug) {
  return serviceTitleBySlug.has(slug);
}

function folderAncestors(slug: FolderSlug): FolderSlug[] {
  const result: FolderSlug[] = [];
  let current: FolderSlug | null = slug;
  while (current) {
    result.push(current);
    current = folders[current].parent;
  }
  return result;
}

function folderScope(root: FolderSlug, includeChildren: boolean) {
  const result = new Set<FolderSlug>([root]);
  if (!includeChildren) return result;
  let changed = true;
  while (changed) {
    changed = false;
    for (const slug of folderSlugs) {
      const folder = folders[slug];
      if (folder.parent && result.has(folder.parent) && !result.has(slug)) {
        result.add(slug);
        changed = true;
      }
    }
  }
  return result;
}
