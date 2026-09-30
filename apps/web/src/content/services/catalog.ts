import catalog from "./catalog.json";

// The web owns the service list. This catalog is the single source of truth for
// service identity (slug and labels) — it drives the service pages here and
// is read by the media manager (apps/media) so photos can be filed under a
// service. The manager can assign services to photos but never edits this list.
export type ServiceIdentity = {
  slug: string;
  title: string;
  navLabel: string;
};

// A service slug is any slug in the catalog. Kept as a string alias rather than a
// generated union: the media generator validates every photo's services against
// the live catalog, so an unknown slug fails the build, not typechecking.
export type ServiceSlug = string;

export const serviceCatalog = catalog as ServiceIdentity[];

export const serviceSlugs = serviceCatalog.map((service) => service.slug);
