import { createFileRoute } from "@tanstack/react-router";

import { absoluteSiteUrl, siteSettings } from "@/content";
import { publicCacheHeaders } from "@/lib/http-cache";

const productionHost = new URL(siteSettings.url).host;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        // Staging and preview hosts serve the same pages with production
        // canonicals; only the production host is open to crawlers.
        const crawlable = new URL(request.url).host === productionHost;
        const body = crawlable
          ? `User-agent: *
Allow: /

Sitemap: ${absoluteSiteUrl("/sitemap.xml")}
`
          : `User-agent: *
Disallow: /
`;

        return new Response(body, {
          headers: {
            ...publicCacheHeaders,
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      },
    },
  },
});
