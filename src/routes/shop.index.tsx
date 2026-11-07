import { createFileRoute } from "@tanstack/react-router";

import { getCommerceClient } from "@/lib/commerce/client";
import { breadcrumbSchema, seo } from "@/lib/seo";
import { ShopIndexPage } from "@/pages/shop";

export const Route = createFileRoute("/shop/")({
  loader: async ({ context }) => {
    const client = await getCommerceClient(context.commerce);
    return client.listProducts();
  },
  staleTime: 60_000,
  head: () =>
    seo({
      title: "Shop",
      description:
        "Order listed products online. Custom signs and installation work still go through enquiry.",
      pathname: "/shop",
      schema: [
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "Shop", pathname: "/shop" },
        ]),
      ],
    }),
  component: ShopRoute,
});

function ShopRoute() {
  return <ShopIndexPage products={Route.useLoaderData()} />;
}
