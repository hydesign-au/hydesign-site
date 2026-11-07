/// <reference types="vite/client" />

import { HeadContent, Outlet, Scripts, createRootRoute, redirect } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { PublicLayout } from "@/layout/public-layout";
import { ThemeProvider } from "@/layout/theme-provider";
import { getCommerceConfig } from "@/lib/commerce/commerce.functions";
import { publicCacheHeaders } from "@/lib/http-cache";
import { NotFoundPage } from "@/pages/not-found";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  headers: () => publicCacheHeaders,
  beforeLoad: async ({ location }) => {
    const pathname =
      location.pathname.length > 1 ? location.pathname.replace(/\/+$/, "") : location.pathname;
    const destination = legacyRedirects[pathname];
    if (destination) {
      throw redirect({ href: `${destination}${location.searchStr}`, statusCode: 301 });
    }
    if (pathname !== location.pathname) {
      throw redirect({ href: `${pathname}${location.searchStr}`, statusCode: 301 });
    }

    return { commerce: await getCommerceConfig() };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "color-scheme", content: "light dark" },
      // Fallback title/description for any route without its own head(); pages
      // override these. Site-wide social constants live here so seo() needn't repeat them.
      { title: "Signwriters Langwarrin, Frankston & Melbourne | HyDesign" },
      {
        name: "description",
        content:
          "Family signwriting and printing business in Langwarrin, established 1980. Shop, vehicle, window and wall signs across Frankston, the Peninsula and Melbourne.",
      },
      { property: "og:site_name", content: "HyDesign" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_AU" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

// Permanent replacements for URLs indexed from the previous WordPress site.
// Keep these at the root so old links do not need placeholder route components.
const legacyRedirects: Readonly<Record<string, string>> = {
  "/about-us": "/about",
  "/contact-us": "/contact",
  "/hand-painted-signs": "/services/hand-painted-signage",
  "/graphic-design": "/services/graphic-design",
  "/neon-signage": "/services/illuminated-signage",
  "/3d-signage": "/services/3d-signage",
  "/a-frame-signs": "/services/a-frame-signage",
  "/banners": "/services/banners",
  "/decals": "/services/stickers-decals",
  "/lightboxes": "/services/illuminated-signage",
  "/digital-printing": "/services/digital-printing",
  "/fascia-signage": "/services/shopfront-building-signage",
  "/window-signage": "/services/window-signage",
  "/vehicle-signage": "/services/vehicle-signage",
  "/wall-graphics": "/services/wall-graphics",
  "/factory-signage": "/services",
  "/terms-conditions": "/terms-of-trade",
  "/project/rebel-blue-project": "/projects",
  "/project/rocomamas-project": "/projects/rocomamas",
  "/project/platform-one": "/projects/platform-one",
  "/project/rosella-mural": "/projects/rosella-mural",
  "/project/edge-geelong-project": "/projects/edge-geelong",
};

function RootComponent() {
  const { commerce } = Route.useRouteContext();

  return (
    <RootDocument>
      <PublicLayout shopEnabled={commerce.shopEnabled}>
        <Outlet />
      </PublicLayout>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <head>
        <HeadContent />
        <meta content="#efe7db" media="(prefers-color-scheme: light)" name="theme-color" />
        <meta content="#14100a" media="(prefers-color-scheme: dark)" name="theme-color" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
