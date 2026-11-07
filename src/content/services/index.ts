import { threeDSignage } from "./3d-signage";
import { aFrameSignage } from "./a-frame-signage";
import { banners } from "./banners";
import { serviceCatalog } from "./catalog";
import { digitalPrinting } from "./digital-printing";
import { graphicDesign } from "./graphic-design";
import { handPaintedSignage } from "./hand-painted-signage";
import { illuminatedSignage } from "./illuminated-signage";
import { shopfrontBuildingSignage } from "./shopfront-building-signage";
import { stickersDecals } from "./stickers-decals";
import type { Service, ServiceContent } from "./types";
import { vehicleSignage } from "./vehicle-signage";
import { wallGraphics } from "./wall-graphics";
import { windowSignage } from "./window-signage";

// The active services: every copy module below gets a route, a nav entry and a
// service-index card. Catalog entries without a copy module (factory-signage) are
// deferred routes — the media library can file photos under them, but the site
// does not build or link a page until the photos and facts exist.
const content: ServiceContent[] = [
  handPaintedSignage,
  threeDSignage,
  illuminatedSignage,
  digitalPrinting,
  stickersDecals,
  windowSignage,
  wallGraphics,
  vehicleSignage,
  banners,
  aFrameSignage,
  graphicDesign,
  shopfrontBuildingSignage,
];

const contentBySlug = new Map(content.map((service) => [service.slug, service]));

// Merge catalog identity with copy, keeping catalog order. A copy module whose
// slug is missing from the catalog is a wiring mistake surfaced loudly.
export const services: Service[] = serviceCatalog
  .filter((identity) => contentBySlug.has(identity.slug))
  .map((identity) => {
    const copy = contentBySlug.get(identity.slug);
    if (!copy) throw new Error(`unreachable: no copy for "${identity.slug}"`);
    return { ...identity, ...copy };
  });

for (const copy of content) {
  if (!serviceCatalog.some((identity) => identity.slug === copy.slug)) {
    throw new Error(`service copy module "${copy.slug}" is not in the catalog`);
  }
}

export function serviceHref(service: Pick<Service, "slug">) {
  return `/services/${service.slug}`;
}

// The homepage preview cards, most enquiry-worthy first.
const homepageSlugs = [
  "hand-painted-signage",
  "stickers-decals",
  "shopfront-building-signage",
  "window-signage",
  "wall-graphics",
  "vehicle-signage",
  "banners",
  "illuminated-signage",
  "3d-signage",
  "digital-printing",
  "a-frame-signage",
  "graphic-design",
];

export const homepageServices: Service[] = homepageSlugs.map((slug) => {
  const service = services.find((entry) => entry.slug === slug);
  if (!service) throw new Error(`homepage service "${slug}" is not an active service`);
  return service;
});

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
