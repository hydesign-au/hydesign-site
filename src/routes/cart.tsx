import { createFileRoute, notFound } from "@tanstack/react-router";

import { getCommerceClient } from "@/lib/commerce/client";
import { privateNoStoreHeaders } from "@/lib/http-cache";
import { seo } from "@/lib/seo";
import { CartPage } from "@/pages/shop/cart";

export const Route = createFileRoute("/cart")({
  beforeLoad: ({ context }) => {
    if (!context.commerce.shopEnabled) throw notFound();
  },
  loader: async ({ context }) => {
    const client = await getCommerceClient(context.commerce);
    return client.getStorefront();
  },
  staleTime: 5 * 60_000,
  headers: () => privateNoStoreHeaders,
  head: () =>
    seo({
      title: "Cart",
      description: "Review your cart before checkout.",
      pathname: "/cart",
      robots: "noindex,nofollow",
    }),
  component: CartRoute,
});

function CartRoute() {
  return <CartPage storefront={Route.useLoaderData()} />;
}
