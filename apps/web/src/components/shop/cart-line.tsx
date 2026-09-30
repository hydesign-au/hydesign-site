import { Button } from "@hydesign/ui/components/button";
import { Link } from "@tanstack/react-router";
import { LoaderCircleIcon, MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { Pending } from "@/components/pending";
import { cartActions, useCartStore } from "@/lib/commerce/cart-store";
import { adjustQuantity, formatMoney, selectedOptionsLabel } from "@/lib/commerce/product";
import type { CartLine as CartLineData } from "@/lib/commerce/types";

type CartLineProps = {
  line: CartLineData;
  disabled: boolean;
  compact?: boolean;
};

function CartLine({ compact, disabled, line }: CartLineProps) {
  const { pendingAction } = useCartStore();
  const { merchandise } = line;
  const optionLabel = selectedOptionsLabel(merchandise.selectedOptions);
  const decreaseQuantity = adjustQuantity(line.quantity, merchandise, -1);
  const increaseQuantity = adjustQuantity(line.quantity, merchandise, 1);
  const decreasing =
    pendingAction?.type === "update" &&
    pendingAction.lineId === line.id &&
    pendingAction.quantity === decreaseQuantity;
  const increasing =
    pendingAction?.type === "update" &&
    pendingAction.lineId === line.id &&
    pendingAction.quantity === increaseQuantity;
  const removing = pendingAction?.type === "remove" && pendingAction.lineId === line.id;
  const decreaseDisabled =
    (disabled && !decreasing) ||
    !line.instructions.canUpdateQuantity ||
    line.quantity <= merchandise.quantityRule.minimum;
  const increaseDisabled =
    (disabled && !increasing) ||
    !line.instructions.canUpdateQuantity ||
    (merchandise.quantityRule.maximum !== null &&
      line.quantity >= merchandise.quantityRule.maximum);
  const removeDisabled = (disabled && !removing) || !line.instructions.canRemove;

  return (
    <li className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 py-4 first:pt-2 last:pb-2 md:grid-cols-[5.5rem_minmax(0,1fr)]">
      <Link
        to="/shop/$handle"
        params={{ handle: merchandise.productHandle }}
        className="overflow-hidden rounded-lg bg-muted"
        aria-label={`View ${merchandise.productTitle}`}
      >
        {merchandise.image ? (
          <img
            src={merchandise.image.url}
            alt={merchandise.image.altText ?? merchandise.productTitle}
            width={merchandise.image.width ?? undefined}
            height={merchandise.image.height ?? undefined}
            className="aspect-square size-full object-cover"
          />
        ) : (
          <span className="flex aspect-square items-center justify-center text-xs text-muted-foreground">
            No image
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to="/shop/$handle"
              params={{ handle: merchandise.productHandle }}
              className="font-semibold leading-snug hover:text-primary-ink"
            >
              {merchandise.productTitle}
            </Link>
            {optionLabel ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{optionLabel}</p>
            ) : null}
          </div>
          <p className="shrink-0 text-sm font-semibold">{formatMoney(line.cost.totalAmount)}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center rounded-lg border border-input bg-background">
            <Pending isPending={decreasing} disabled={decreaseDisabled}>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={decreaseDisabled}
                onClick={() => void cartActions.updateLine(line.id, decreaseQuantity)}
                aria-label={`Decrease ${merchandise.productTitle} quantity`}
              >
                {decreasing ? <LoaderCircleIcon className="animate-spin" /> : <MinusIcon />}
              </Button>
            </Pending>
            <span className="min-w-7 text-center text-xs tabular-nums">{line.quantity}</span>
            <Pending isPending={increasing} disabled={increaseDisabled}>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={increaseDisabled}
                onClick={() => void cartActions.updateLine(line.id, increaseQuantity)}
                aria-label={`Increase ${merchandise.productTitle} quantity`}
              >
                {increasing ? <LoaderCircleIcon className="animate-spin" /> : <PlusIcon />}
              </Button>
            </Pending>
          </div>

          <Pending isPending={removing} disabled={removeDisabled}>
            <Button
              type="button"
              variant="ghost"
              size={compact ? "icon-xs" : "icon-sm"}
              disabled={removeDisabled}
              onClick={() => void cartActions.removeLine(line.id)}
              aria-label={`Remove ${merchandise.productTitle}`}
            >
              {removing ? <LoaderCircleIcon className="animate-spin" /> : <Trash2Icon />}
            </Button>
          </Pending>
        </div>
      </div>
    </li>
  );
}

export { CartLine };
