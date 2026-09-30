import { Badge } from "@hydesign/ui/components/badge";
import { Button } from "@hydesign/ui/components/button";
import { Separator } from "@hydesign/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@hydesign/ui/components/sheet";
import { ShoppingCartIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { CartContents } from "@/components/shop/cart-contents";
import { CartSummary } from "@/components/shop/cart-summary";
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
            size="lg"
            className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 h-11 rounded-full px-4 animate-in fade-in zoom-in-95 duration-200"
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
