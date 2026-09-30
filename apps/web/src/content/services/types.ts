import type { FolderSlug, ImageKey, VideoKey } from "../media.gen";
import type { ServiceIdentity } from "./catalog";

export type GalleryOrientation = "landscape" | "portrait";

export type TitleTreatment = {
  accent: string;
  effect: "3d" | "brush" | "neon";
};

// One to three photos. The fan and mosaic have a layout for each count, so a
// short group never shows an empty slot.
export type PhotoGroup = [ImageKey] | [ImageKey, ImageKey] | [ImageKey, ImageKey, ImageKey];

export type ServiceSection = {
  title: string;
  description: string;
  photos: PhotoGroup;
};

// The copy for one active service, keyed by slug. Identity (title, navLabel,
// family) comes from the catalog and is merged on in index.ts — a copy module
// never restates it. Gallery photos are filed under the service in the media
// library; singleton placements use explicit typed keys.
export type ServiceContent = {
  slug: string;
  galleryFolder: FolderSlug;
  includeChildGalleryFolders?: boolean;
  // Title-tag keyword phrase without the brand suffix, e.g. "Hand-Painted Signage Melbourne".
  seoTitle: string;
  metaDescription: string;
  // The search-friendly sentence under the plain H1.
  heroSubtitle: string;
  // One short, factual paragraph in the business's voice.
  intro: string;
  titleTreatment?: TitleTreatment;
  // Hand-picked hero photo; also the service's card image everywhere.
  heroImage: ImageKey;
  heroVideo?: VideoKey;
  galleryOrientation: GalleryOrientation;
  sections?: ServiceSection[];
};

export type Service = ServiceIdentity & ServiceContent;
