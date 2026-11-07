import { createFileRoute } from "@tanstack/react-router";

import { buildLlmsText } from "@/content";
import { publicCacheHeaders } from "@/lib/http-cache";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildLlmsText(), {
          headers: {
            ...publicCacheHeaders,
            "Content-Type": "text/plain; charset=utf-8",
          },
        }),
    },
  },
});
