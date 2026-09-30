import { createFileRoute } from "@tanstack/react-router";

import { getInstagramFeed } from "@/lib/instagram.functions";
import { localBusinessSchema, seo, websiteSchema } from "@/lib/seo";
import { HomePage } from "@/pages/home";

export const Route = createFileRoute("/")({
  loader: () => getInstagramFeed(),
  staleTime: 10 * 60 * 1000,
  head: () =>
    seo({
      title: "Signwriters Langwarrin, Frankston & Melbourne",
      description:
        "Family signwriting and printing business in Langwarrin, established 1980. Shop, vehicle, window and wall signs across Frankston, the Peninsula and Melbourne.",
      pathname: "/",
      schema: [localBusinessSchema(), websiteSchema()],
    }),
  component: HomeRoute,
});

function HomeRoute() {
  return <HomePage instagramFeed={Route.useLoaderData()} />;
}
