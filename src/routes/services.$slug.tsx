import { createFileRoute, notFound } from "@tanstack/react-router";

import { getService } from "@/content";
import { breadcrumbSchema, seo, serviceSchema } from "@/lib/seo";
import { ServicePageTemplate } from "@/templates/service-page";

type SlugRouteHeadArgs = {
  params: {
    slug: string;
  };
};

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ params }: SlugRouteHeadArgs) => {
    const service = getService(params.slug);
    if (!service) return {};

    return seo({
      title: service.seoTitle,
      description: service.metaDescription,
      pathname: `/services/${service.slug}`,
      schema: [
        serviceSchema(service),
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "Services", pathname: "/services" },
          { name: service.title, pathname: `/services/${service.slug}` },
        ]),
      ],
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { service } = Route.useLoaderData();
  return <ServicePageTemplate service={service} />;
}
