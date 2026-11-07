import { ProductCard } from "@/components/shop/product-card";
import { MarketingHero } from "@/layout/marketing-hero";
import { PageSection } from "@/layout/page-section";
import type { Product } from "@/lib/commerce/types";

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

export { ShopIndexPage };
