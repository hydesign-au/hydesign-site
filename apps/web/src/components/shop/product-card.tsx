import { Button } from "@hydesign/ui/components/button";
import { Card } from "@hydesign/ui/components/card";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, CheckIcon, LoaderCircleIcon, ShoppingCartIcon } from "lucide-react";
import { useState } from "react";

import { Pending } from "@/components/pending";
import { cartActions } from "@/lib/commerce/cart-store";
import { formatProductPrice, getQuickAddVariant } from "@/lib/commerce/product";
import type { Product } from "@/lib/commerce/types";

type ProductCardProps = {
  product: Product;
};

type QuickAddStatus = "idle" | "adding" | "added" | "error";

function ProductCard({ product }: ProductCardProps) {
  const [status, setStatus] = useState<QuickAddStatus>("idle");
  const quickAddVariant = getQuickAddVariant(product);

  async function quickAdd() {
    if (!quickAddVariant) return;

    setStatus("adding");
    const cart = await cartActions.addLine({ merchandiseId: quickAddVariant.id, quantity: 1 });
    setStatus(cart ? "added" : "error");
  }

  return (
    <Card className="rounded-(--site-panel-radius) group relative aspect-4/3 gap-0 overflow-hidden py-0 ring-white/15">
      <Link
        to="/shop/$handle"
        params={{ handle: product.handle }}
        className="absolute inset-0"
        aria-label={`View ${product.title}`}
      >
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            width={product.featuredImage.width ?? undefined}
            height={product.featuredImage.height ?? undefined}
            className="motion-media size-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="flex size-full items-center justify-center bg-muted text-sm text-muted-foreground">
            Product image unavailable
          </span>
        )}
      </Link>

      <div className="text-shadow-photo pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-photo-scrim/90 via-photo-scrim/65 to-transparent p-4 pt-20 text-white">
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 text-lg font-black leading-tight">{product.title}</h2>
          <span className="shrink-0 text-sm font-semibold">{formatProductPrice(product)}</span>
        </div>

        {product.description ? (
          <p className="mt-1 line-clamp-1 text-sm leading-5 text-white/75">{product.description}</p>
        ) : null}

        <div className="mt-3 flex min-h-7 items-center justify-end">
          {quickAddVariant ? (
            <Pending isPending={status === "adding"}>
              <Button
                type="button"
                size="icon-sm"
                variant="secondary"
                className="pointer-events-auto relative z-10 rounded-full"
                onClick={() => void quickAdd()}
                aria-label={
                  status === "added"
                    ? `${product.title} added to cart`
                    : `Add ${product.title} to cart`
                }
              >
                {status === "adding" ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : status === "added" ? (
                  <CheckIcon />
                ) : (
                  <ShoppingCartIcon />
                )}
              </Button>
            </Pending>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-white">
              {product.availableForSale ? "Details" : "Sold out"}
              <ArrowRightIcon className="motion-arrow size-3.5" />
            </span>
          )}
        </div>

        <span className="sr-only" aria-live="polite">
          {status === "added"
            ? `${product.title} added to cart.`
            : status === "error"
              ? `${product.title} could not be added to cart.`
              : ""}
        </span>
      </div>
    </Card>
  );
}

export { ProductCard };
