import { ShoppingCartIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { CartContents } from "@/components/shop/cart-contents";
import { CartSummary } from "@/components/shop/cart-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cartActions, useCartStore } from "@/lib/commerce/cart-store";

function FloatingCart() {
  const [open, setOpen] = useState(false);
  const { cart } = useCartStore();
  const itemCount = cart?.totalQuantity ?? 0;
  const itemLabel = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;

  useEffect(() => {
    void cartActions.loadStoredCart();
  }, []);

  if (itemCount === 0 && !open) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            size="xl"
            className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 rounded-full motion-safe:animate-content-in"
            aria-label={`Open cart, ${itemLabel}`}
          />
        }
      >
        <ShoppingCartIcon data-icon="inline-start" />
        <span>Cart</span>
        <Badge variant="secondary" className="min-w-5 px-1.5 tabular-nums">
          {itemCount}
        </Badge>
      </SheetTrigger>

      <SheetContent className="w-full max-w-md gap-0">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>{itemLabel}</SheetDescription>
        </SheetHeader>
        <Separator />
        <CartContents compact className="min-h-0 flex-1 overflow-y-auto px-4 py-2" />
        <Separator />
        <CartSummary compact className="p-4" />
      </SheetContent>
    </Sheet>
  );
}

export { FloatingCart };
