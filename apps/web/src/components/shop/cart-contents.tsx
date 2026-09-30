import { Separator } from "@hydesign/ui/components/separator";
import { Skeleton } from "@hydesign/ui/components/skeleton";
import { cn } from "@hydesign/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { Fragment } from "react";

import { CartLine } from "@/components/shop/cart-line";
import { useCartStore } from "@/lib/commerce/cart-store";

type CartContentsProps = {
  className?: string;
  compact?: boolean;
};

function CartContents({ className, compact }: CartContentsProps) {
  const { cart, error, status } = useCartStore();

  if (status === "loading") {
    return (
      <div className={cn("flex flex-col gap-3 py-2", className)} aria-label="Loading cart">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className={cn("text-sm text-destructive", className)}>{error}</p>;
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className={cn("flex flex-col items-start gap-3 text-sm", className)}>
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link to="/shop" className="font-medium underline underline-offset-4">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <ul className={className}>
      {cart.lines.map((line, index) => (
        <Fragment key={line.id}>
          {index > 0 ? <Separator render={<li aria-hidden />} /> : null}
          <CartLine line={line} compact={compact} disabled={status === "updating"} />
        </Fragment>
      ))}
    </ul>
  );
}

export { CartContents };
