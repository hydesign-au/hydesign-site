import { createFileRoute } from "@tanstack/react-router";

import { getContactFormConfig } from "@/lib/contact.functions";
import { breadcrumbSchema, seo } from "@/lib/seo";
import { ContactPage } from "@/pages/contact";

type ContactSearch = {
  service?: string;
};

export const Route = createFileRoute("/contact")({
  loader: () => getContactFormConfig(),
  validateSearch: (search: Record<string, unknown>): ContactSearch => {
    return typeof search.service === "string" && search.service ? { service: search.service } : {};
  },
  head: () =>
    seo({
      title: "Contact",
      description:
        "Call 0410 544 641 or send an enquiry. Family signwriting and printing business in Langwarrin, working across Frankston, the Mornington Peninsula and Melbourne.",
      pathname: "/contact",
      schema: [
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "Contact", pathname: "/contact" },
        ]),
      ],
    }),
  component: RouteComponent,
});

function RouteComponent() {
  const { service } = Route.useSearch();
  return <ContactPage formConfig={Route.useLoaderData()} initialService={service} />;
}
