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

export const serviceCatalog = catalog as ServiceIdentity[];
