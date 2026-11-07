import { createFileRoute } from "@tanstack/react-router";

import { breadcrumbSchema, seo } from "@/lib/seo";
import { GalleryPage } from "@/pages/gallery";

export const Route = createFileRoute("/gallery")({
  head: () =>
    seo({
      title: "Signage Gallery",
      description:
        "Photos of signs we have painted, printed, fabricated and installed around Melbourne.",
      pathname: "/gallery",
      schema: [
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "Gallery", pathname: "/gallery" },
        ]),
      ],
    }),
  component: GalleryPage,
});
