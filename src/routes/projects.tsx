import { Outlet, createFileRoute } from "@tanstack/react-router";

// Layout for /projects and /projects/$slug. This only supplies the nesting Outlet
// and deliberately carries no head(), so detail pages aren't saddled with the
// listing's canonical.
export const Route = createFileRoute("/projects")({
  component: ProjectsLayout,
});

function ProjectsLayout() {
  return <Outlet />;
}
