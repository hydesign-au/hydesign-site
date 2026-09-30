import { createFileRoute } from "@tanstack/react-router";

import { breadcrumbSchema, seo } from "@/lib/seo";
import { ProjectsPage } from "@/pages/projects/index";

export const Route = createFileRoute("/projects/")({
  head: () =>
    seo({
      title: "Signage Projects",
      description:
        "Signage projects for Rosella, Edge Geelong, Platform One and RocoMamas, including hand-painted murals, custom neon, lit signs and a 17-metre glass mosaic wall.",
      pathname: "/projects",
      schema: [
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "Projects", pathname: "/projects" },
        ]),
      ],
    }),
  component: ProjectsPage,
});
