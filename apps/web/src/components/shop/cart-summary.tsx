import { Button } from "@hydesign/ui/components/button";
import { cn } from "@hydesign/ui/lib/utils";

import { cartActions, useCartStore } from "@/lib/commerce/cart-store";
import { formatMoney } from "@/lib/commerce/product";
import type { Storefront } from "@/lib/commerce/types";

type CartSummaryProps = {
  className?: string;
  compact?: boolean;
  storefront?: Storefront;
};

function CartSummary({ className, compact, storefront }: CartSummaryProps) {
  const { cart, status } = useCartStore();
  const empty = !cart || cart.lines.length === 0;
  const disabled = status === "loading" || status === "updating" || empty;

  return (
    <aside className={cn("flex flex-col gap-4", className)} aria-label="Cart summary">
      <div className="flex items-center justify-between font-semibold">
        <span>Subtotal</span>
        <span>
          {cart
            ? formatMoney(cart.cost.subtotalAmount)
            : formatMoney({ amount: "0", currencyCode: "AUD" })}
        </span>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        Final costs are confirmed at checkout.
      </p>
      <Button type="button" size="lg" disabled={disabled} onClick={() => cartActions.checkout()}>
        Checkout
      </Button>

      {!compact && storefront ? (
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {storefront.customerAccountUrl ? (
            <a href={storefront.customerAccountUrl}>Account</a>
          ) : null}
          {storefront.policies.map((policy) => (
            <a key={policy.url} href={policy.url}>
              {policy.title}
            </a>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

export { CartSummary };
