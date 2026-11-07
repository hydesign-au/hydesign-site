import { PhotoBlurb } from "@/components/photo-blurb";
import type { Project } from "@/content";

type ProjectsGridProps = {
  projects: Project[];
  // h2 when the grid sits directly under the page H1 (the projects index).
  headingLevel?: "h2" | "h3";
};

function ProjectsGrid({ projects, headingLevel }: ProjectsGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {projects.map((project) => (
        <PhotoBlurb
          key={project.slug}
          href={`/projects/${project.slug}`}
          headingLevel={headingLevel}
          image={project.heroImage}
          title={project.title}
          subtitle={project.summary}
        />
      ))}
    </div>
  );
}

export { ProjectsGrid };
