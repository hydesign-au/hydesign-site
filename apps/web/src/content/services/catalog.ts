export type ServiceIdentity = {
  slug: string;
  title: string;
  navLabel: string;
  // Narrower kinds of work that photos can be tagged with. They roll up into this service.
  subservices?: readonly string[];
};

// Every service the site knows, in nav order. A service gets a page once it has a copy module
// in ./index.ts.
export const serviceCatalog = [
  {
    slug: "hand-painted-signage",
    title: "Hand-Painted Signage",
    navLabel: "Hand-Painted Signage",
  },
  {
    slug: "3d-signage",
    title: "3D Signage",
    navLabel: "3D Signage",
  },
  {
    slug: "illuminated-signage",
    title: "Illuminated Signage",
    navLabel: "Illuminated Signage",
    subservices: ["led-neon", "lightboxes", "neon"],
  },
  {
    slug: "digital-printing",
    title: "Digital Printing",
    navLabel: "Digital Printing",
    subservices: ["hoarding"],
  },
  {
    slug: "stickers-decals",
    title: "Stickers & Decals",
    navLabel: "Stickers & Decals",
  },
  {
    slug: "window-signage",
    title: "Window Signage",
    navLabel: "Window Signage",
    subservices: ["etch", "gold-leaf", "one-way-vision"],
  },
  {
    slug: "wall-graphics",
    title: "Wall Graphics",
    navLabel: "Wall Graphics",
  },
  {
    slug: "vehicle-signage",
    title: "Vehicle Signage",
    navLabel: "Vehicle Signage",
  },
  {
    slug: "banners",
    title: "Banners",
    navLabel: "Banners",
  },
  {
    slug: "a-frame-signage",
    title: "A-Frame Signage",
    navLabel: "A-Frame Signage",
  },
  {
    slug: "shopfront-building-signage",
    title: "Shopfront & Building Signage",
    navLabel: "Shopfront & Building Signage",
    subservices: ["fascia-signage", "hanging-sign", "menu-board"],
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    navLabel: "Graphic Design",
  },
  {
    slug: "factory-signage",
    title: "Factory & Industrial Signage",
    navLabel: "Factory & Industrial Signage",
  },
] as const satisfies readonly ServiceIdentity[];

type CatalogEntry = (typeof serviceCatalog)[number];

export type ServiceSlug =
  | CatalogEntry["slug"]
  | Extract<CatalogEntry, { subservices: readonly string[] }>["subservices"][number];

const parentBySubservice = new Map<string, string>(
  serviceCatalog.flatMap((service) =>
    "subservices" in service ? service.subservices.map((sub) => [sub, service.slug]) : [],
  ),
);

// The catalog service a slug belongs to: itself, or the parent of a subservice.
export function catalogSlug(slug: ServiceSlug): string {
  return parentBySubservice.get(slug) ?? slug;
}
