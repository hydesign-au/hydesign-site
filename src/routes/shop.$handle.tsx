import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { CheckIcon, LoaderCircleIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { PageSection } from "@/components/page-section";
import { Pending } from "@/components/pending";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductOptions } from "@/components/shop/product-options";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cartActions } from "@/lib/commerce/cart-store";
import { getCommerceClient } from "@/lib/commerce/client";
import {
  getProductMetaDescription,
  adjustQuantity,
  formatMoney,
  getInitialVariant,
  getProductImages,
  getVariantForSelections,
  selectionsFromVariant,
} from "@/lib/commerce/product";
import { type Product, type Storefront } from "@/lib/commerce/types";
import { breadcrumbSchema, productSchema, seo } from "@/lib/seo";

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

type ShopDetailPageProps = {
  product: Product;
  storefront: Storefront;
};

type AddStatus = "idle" | "adding" | "added" | "error";

function ShopDetailPage({ product, storefront }: ShopDetailPageProps) {
  const initialVariant = getInitialVariant(product);
  const images = getProductImages(product);
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    selectionsFromVariant(initialVariant),
  );
  const [quantity, setQuantity] = useState(initialVariant?.quantityRule.minimum ?? 1);
  const [selectedImage, setSelectedImage] = useState(
    initialVariant?.image ?? images[0] ?? product.featuredImage,
  );
  const [addStatus, setAddStatus] = useState<AddStatus>("idle");
  const selectedVariant = getVariantForSelections(product, selections) ?? initialVariant;
  const canPurchase = selectedVariant?.availableForSale && !product.requiresSellingPlan;

  function selectOption(name: string, value: string) {
    const nextSelections = { ...selections, [name]: value };
    const nextVariant = getVariantForSelections(product, nextSelections);

    setSelections(nextSelections);
    setAddStatus("idle");

    if (nextVariant) {
      setQuantity(nextVariant.quantityRule.minimum);
      if (nextVariant.image) setSelectedImage(nextVariant.image);
    }
  }

  async function addSelectedVariant() {
    if (!selectedVariant || !canPurchase || addStatus === "adding") return;

    setAddStatus("adding");
    const cart = await cartActions.addLine({
      merchandiseId: selectedVariant.id,
      quantity,
    });
    setAddStatus(cart ? "added" : "error");
  }

  return (
    <PageSection className="pt-24 md:pt-28">
      <article className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-start lg:gap-12">
        <ProductGallery
          images={images}
          productTitle={product.title}
          selectedImage={selectedImage ?? null}
          onSelect={setSelectedImage}
        />

        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
          <div>
            <h1 className="text-3xl font-black leading-tight md:text-5xl">{product.title}</h1>
            {selectedVariant ? (
              <div className="mt-4 flex items-baseline gap-3">
                <p className="text-2xl font-semibold">{formatMoney(selectedVariant.price)}</p>
                {selectedVariant.compareAtPrice ? (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatMoney(selectedVariant.compareAtPrice)}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <ProductOptions product={product} selections={selections} onSelect={selectOption} />

          {selectedVariant ? (
            <div className="flex items-center justify-between rounded-lg border border-input bg-background p-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={quantity <= selectedVariant.quantityRule.minimum}
                onClick={() => setQuantity(adjustQuantity(quantity, selectedVariant, -1))}
                aria-label="Decrease quantity"
              >
                <MinusIcon />
              </Button>
              <span
                className="text-sm font-medium tabular-nums"
                aria-label={`Quantity ${quantity}`}
              >
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={
                  selectedVariant.quantityRule.maximum !== null &&
                  quantity >= selectedVariant.quantityRule.maximum
                }
                onClick={() => setQuantity(adjustQuantity(quantity, selectedVariant, 1))}
                aria-label="Increase quantity"
              >
                <PlusIcon />
              </Button>
            </div>
          ) : null}

          <Pending isPending={addStatus === "adding"} disabled={!canPurchase}>
            <Button
              type="button"
              size="lg"
              disabled={!canPurchase}
              onClick={() => void addSelectedVariant()}
            >
              {addStatus === "adding" ? (
                <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
              ) : addStatus === "added" ? (
                <CheckIcon data-icon="inline-start" />
              ) : null}
              {product.requiresSellingPlan
                ? "Purchase Options Unavailable"
                : !selectedVariant?.availableForSale
                  ? "Sold Out"
                  : addStatus === "adding"
                    ? "Adding"
                    : addStatus === "added"
                      ? "Added"
                      : "Add to Cart"}
            </Button>
          </Pending>

          <div className="min-h-5 text-sm" aria-live="polite">
            {addStatus === "added" ? (
              <p className="text-muted-foreground">
                Added to cart.{" "}
                <Link to="/cart" className="underline underline-offset-4">
                  View cart
                </Link>
              </p>
            ) : addStatus === "error" ? (
              <p className="text-destructive">Cart could not be updated.</p>
            ) : selectedVariant?.currentlyNotInStock ? (
              <p className="text-muted-foreground">Available to order.</p>
            ) : null}
          </div>

          {product.description || storefront.policies.length > 0 ? (
            <Accordion defaultValue={product.description ? ["details"] : []}>
              {product.description ? (
                <AccordionItem value="details">
                  <AccordionTrigger className="text-base">Product details</AccordionTrigger>
                  <AccordionContent className="leading-6 text-muted-foreground">
                    <p>{product.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ) : null}

              {storefront.policies.length > 0 ? (
                <AccordionItem value="policies">
                  <AccordionTrigger className="text-base">Shipping and returns</AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex flex-col gap-2 text-muted-foreground">
                      {storefront.policies.map((policy) => (
                        <li key={policy.url}>
                          <a href={policy.url}>{policy.title}</a>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ) : null}
            </Accordion>
          ) : null}
        </div>
      </article>
    </PageSection>
  );
}
