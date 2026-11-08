import { createFileRoute, notFound } from "@tanstack/react-router";

import { PageHeader, PageSection } from "@/components/page-section";
import { CartContents } from "@/components/shop/cart-contents";
import { CartSummary } from "@/components/shop/cart-summary";
import { getCommerceClient } from "@/lib/commerce/client";
import { type Storefront } from "@/lib/commerce/types";
import { privateNoStoreHeaders } from "@/lib/http-cache";
import { seo } from "@/lib/seo";

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

type CartPageProps = {
  storefront: Storefront;
};

function CartPage({ storefront }: CartPageProps) {
  return (
    <>
      <PageSection className="pt-24 md:pt-28">
        <PageHeader title="Cart" level={1}>
          Review your cart before checkout.
        </PageHeader>
      </PageSection>

      <PageSection className="pt-0 md:pt-0">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-12">
          <CartContents />
          <CartSummary
            storefront={storefront}
            className="rounded-xl bg-card p-5 ring-1 ring-foreground/10 lg:sticky lg:top-28"
          />
        </div>
      </PageSection>
    </>
  );
}
