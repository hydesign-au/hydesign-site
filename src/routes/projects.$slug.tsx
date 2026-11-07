import { createFileRoute, notFound } from "@tanstack/react-router";

import { getProject } from "@/content";
import { breadcrumbSchema, seo } from "@/lib/seo";
import { ProjectPageTemplate } from "@/templates/project-page";

type SlugRouteHeadArgs = {
  params: {
    slug: string;
  };
};

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ params }: SlugRouteHeadArgs) => {
    const project = getProject(params.slug);
    if (!project) return {};

    return seo({
      title: project.title,
      description: project.metaDescription,
      pathname: `/projects/${project.slug}`,
      schema: [
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "Projects", pathname: "/projects" },
          { name: project.title, pathname: `/projects/${project.slug}` },
        ]),
      ],
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { project } = Route.useLoaderData();
  return <ProjectPageTemplate project={project} />;
}
