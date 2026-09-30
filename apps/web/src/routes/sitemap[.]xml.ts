import { createFileRoute } from "@tanstack/react-router";

import { absoluteSiteUrl, publicRoutes } from "@/content";
import { getCommerceClient } from "@/lib/commerce/client";
import { getCommerceConfig } from "@/lib/commerce/commerce.functions";
import type { StorefrontCommerceConfig } from "@/lib/commerce/config";
import { publicCacheHeaders } from "@/lib/http-cache";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const commerce = await getCommerceConfig();
        const shopRoutes = commerce.shopEnabled ? await getShopRoutes(commerce) : [];
        const urls = [...publicRoutes, ...shopRoutes]
          .map(
            (route) => `  <url>
    <loc>${escapeXml(absoluteSiteUrl(route.pathname))}</loc>
    <changefreq>${route.sitemap.changefreq}</changefreq>
    <priority>${route.sitemap.priority.toFixed(1)}</priority>
  </url>`,
          )
          .join("\n");

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

        return new Response(body, {
          headers: {
            ...publicCacheHeaders,
            "Content-Type": "application/xml; charset=utf-8",
          },
        });
      },
    },
  },
});

async function getShopRoutes(config: StorefrontCommerceConfig) {
  const client = await getCommerceClient(config);
  const products = await client.listProducts();

  return [
    { pathname: "/shop", sitemap: { changefreq: "weekly" as const, priority: 0.6 } },
    ...products.map((product) => ({
      pathname: `/shop/${product.handle}`,
      sitemap: { changefreq: "weekly" as const, priority: 0.5 },
    })),
  ];
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
