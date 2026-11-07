import { createFileRoute } from "@tanstack/react-router";

import { breadcrumbSchema, seo } from "@/lib/seo";
import { ServicesIndexPage } from "@/pages/services/index";

export const Route = createFileRoute("/services/")({
  head: () =>
    seo({
      title: "Signage Services Frankston & Melbourne",
      description:
        "Signwriting, signage and printing for shopfronts, vehicles, windows, walls and events. Family owned in Langwarrin, working across Frankston and Melbourne.",
      pathname: "/services",
      schema: [
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "Services", pathname: "/services" },
        ]),
      ],
    }),
  component: ServicesIndexPage,
});
