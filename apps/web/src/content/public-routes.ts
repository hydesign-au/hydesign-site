import { projects } from "./projects";
import { services } from "./services";
import { siteSettings } from "./site";

type SitemapChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type PublicRoute = {
  pathname: string;
  sitemap: {
    priority: number;
    changefreq: SitemapChangeFrequency;
  };
};

const staticRoutes = [
  {
    pathname: "/",
    sitemap: { priority: 1, changefreq: "monthly" },
  },
  {
    pathname: "/services",
    sitemap: { priority: 0.9, changefreq: "monthly" },
  },
  {
    pathname: "/projects",
    sitemap: { priority: 0.7, changefreq: "monthly" },
  },
  {
    pathname: "/gallery",
    sitemap: { priority: 0.6, changefreq: "monthly" },
  },
  {
    pathname: "/about",
    sitemap: { priority: 0.6, changefreq: "yearly" },
  },
  {
    pathname: "/contact",
    sitemap: { priority: 0.6, changefreq: "yearly" },
  },
  {
    pathname: "/terms-of-trade",
    sitemap: { priority: 0.2, changefreq: "yearly" },
  },
] satisfies PublicRoute[];

const serviceRoutes = services.map((service) => ({
  pathname: `/services/${service.slug}`,
  sitemap: { priority: 0.8, changefreq: "monthly" },
})) satisfies PublicRoute[];

const projectRoutes = projects.map((project) => ({
  pathname: `/projects/${project.slug}`,
  sitemap: { priority: 0.7, changefreq: "monthly" },
})) satisfies PublicRoute[];

// Indexable public routes only, shared by the sitemap and llms.txt.
export const publicRoutes = [
  ...staticRoutes,
  ...serviceRoutes,
  ...projectRoutes,
] satisfies PublicRoute[];

export function absoluteSiteUrl(pathname: string) {
  return pathname === "/" ? siteSettings.url : `${siteSettings.url}${pathname}`;
}
