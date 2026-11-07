import { createFileRoute } from "@tanstack/react-router";

import { MarketingHero } from "@/components/marketing-hero";
import { PageSection } from "@/components/page-section";
import { ProductCard } from "@/components/shop/product-card";
import { getCommerceClient } from "@/lib/commerce/client";
import { type Product } from "@/lib/commerce/types";
import { breadcrumbSchema, seo } from "@/lib/seo";

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

type ShopIndexPageProps = {
  products: Product[];
};

function ShopIndexPage({ products }: ShopIndexPageProps) {
  return (
    <>
      <MarketingHero image="IMG_7324" title="Shop">
        <p>
          Order online when products are listed here. Custom signs and install work still go through
          enquiry.
        </p>
      </MarketingHero>

      <PageSection>
        {products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No products are available yet.</p>
        )}
      </PageSection>
    </>
  );
}
