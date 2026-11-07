import { createFileRoute } from "@tanstack/react-router";

import { MarketingHero } from "@/components/marketing-hero";
import { PageSection } from "@/components/page-section";
import { ProjectsGrid } from "@/components/projects-grid";
import { projects } from "@/content";
import { breadcrumbSchema, seo } from "@/lib/seo";

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

function ProjectsPage() {
  return (
    <>
      <MarketingHero
        image="IMG_5960"
        title="Projects"
        actions={[
          { href: "/contact", label: "Get a Quote" },
          { href: "/services", label: "Services", kind: "secondary" },
        ]}
      >
        <p>Restaurants, nightclubs, shop fit-outs and painted walls.</p>
      </MarketingHero>
      <PageSection>
        <ProjectsGrid projects={projects} headingLevel="h2" />
      </PageSection>
    </>
  );
}
