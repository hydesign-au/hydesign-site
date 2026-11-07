import { ProjectsGrid } from "@/components/projects-grid";
import { projects } from "@/content";
import { MarketingHero } from "@/layout/marketing-hero";
import { PageSection } from "@/layout/page-section";

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

export { ProjectsPage };
