export { imageKeys, photoFile, videos } from "./media";
export type { Client, ImageKey, SiteImage, SiteVideo, VideoKey } from "./media";
export { photos } from "./photos";
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

import { imageKeys, type Client, type ImageKey } from "./media";
import { photos } from "./photos";
import { catalogSlug, serviceCatalog, type ServiceSlug } from "./services/catalog";

type PhotoFacts = { client?: string; location?: string; services?: readonly ServiceSlug[] };

const serviceTitleBySlug = new Map<string, string>(
  serviceCatalog.map((service) => [service.slug, service.title]),
);

function facts(key: ImageKey): PhotoFacts {
  return photos[key];
}

export function imageAlt(key: ImageKey): string {
  const { client, location } = facts(key);
  const subject = [client, location].filter(Boolean).join(", ");
  const services = serviceSlugsForImages([key]).map((slug) => serviceTitleBySlug.get(slug));
  const service = services.length > 1 ? "Signage" : services[0];
  if (!service) return subject;
  return subject ? `${service} for ${subject}` : service;
}

export function imageLabel(key: ImageKey): string {
  const { client, location } = facts(key);
  return client || location || key;
}

export function imageLocation(key: ImageKey): string | undefined {
  return facts(key).location;
}

// Every photo, in photos.ts order.
export function galleryImages(): ImageKey[] {
  return imageKeys;
}

// Photos of a service, including its subservices.
export function servicePhotos(slug: string): ImageKey[] {
  return imageKeys.filter((key) =>
    (facts(key).services ?? []).some((service) => catalogSlug(service) === slug),
  );
}

export function clientPhotos(client: Client): ImageKey[] {
  return imageKeys.filter((key) => facts(key).client === client);
}

// The catalog services shown across these photos, in photo order.
export function serviceSlugsForImages(keys: ImageKey[]): string[] {
  return [...new Set(keys.flatMap((key) => (facts(key).services ?? []).map(catalogSlug)))];
}
