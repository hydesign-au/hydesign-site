import { CartContents } from "@/components/shop/cart-contents";
import { CartSummary } from "@/components/shop/cart-summary";
import { PageHeader, PageSection } from "@/layout/page-section";
import type { Storefront } from "@/lib/commerce/types";

type CartPageProps = {
  storefront: Storefront;
};

function CartPage({ storefront }: CartPageProps) {
  return (
    <>
      <PageSection className="pt-28 pb-8 md:pt-36 md:pb-10" compact>
        <PageHeader title="Cart" level={1}>
          Review your cart before checkout.
        </PageHeader>
      </PageSection>

      <PageSection className="pt-0">
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

export { CartPage };
