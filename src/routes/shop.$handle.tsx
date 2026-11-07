import { createFileRoute, notFound } from "@tanstack/react-router";

import { getCommerceClient } from "@/lib/commerce/client";
import { getProductMetaDescription } from "@/lib/commerce/product";
import { breadcrumbSchema, productSchema, seo } from "@/lib/seo";
import { ShopDetailPage } from "@/pages/shop/detail";

export const Route = createFileRoute("/shop/$handle")({
  beforeLoad: ({ context }) => {
    if (!context.commerce.shopEnabled) throw notFound();
  },
  loader: async ({ context, params }) => {
    const client = await getCommerceClient(context.commerce);
    const [product, storefront] = await Promise.all([
      client.getProduct(params.handle),
      client.getStorefront(),
    ]);
    if (!product) throw notFound();
    return { product, storefront };
  },
  staleTime: 60_000,
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { product } = loaderData;

    return seo({
      title: product.seo.title?.trim() || product.title,
      description: getProductMetaDescription(product),
      pathname: `/shop/${product.handle}`,
      image: product.featuredImage?.url,
      schema: [
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "Shop", pathname: "/shop" },
          { name: product.title, pathname: `/shop/${product.handle}` },
        ]),
        productSchema(product),
      ],
    });
  },
  component: ProductRoute,
});

function ProductRoute() {
  const { product, storefront } = Route.useLoaderData();

  return <ShopDetailPage key={product.id} product={product} storefront={storefront} />;
}
