import { createFileRoute } from "@tanstack/react-router";

import { breadcrumbSchema, seo } from "@/lib/seo";
import { AboutPage } from "@/pages/about";

export const Route = createFileRoute("/about")({
  head: () =>
    seo({
      title: "About Us",
      description:
        "A family signwriting and printing business based in Langwarrin. Trevor trained at the Melbourne College of Decoration and started the business in 1980.",
      pathname: "/about",
      schema: [
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "About", pathname: "/about" },
        ]),
      ],
    }),
  component: AboutPage,
});
