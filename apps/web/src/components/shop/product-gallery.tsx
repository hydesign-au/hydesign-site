import { cn } from "@hydesign/ui/lib/utils";

import type { ProductImage } from "@/lib/commerce/types";

type ProductGalleryProps = {
  images: ProductImage[];
  productTitle: string;
  selectedImage: ProductImage | null;
  onSelect: (image: ProductImage) => void;
};

function ProductGallery({ images, onSelect, productTitle, selectedImage }: ProductGalleryProps) {
  const hasThumbnails = images.length > 1;

  return (
    <div className={cn("grid gap-3", hasThumbnails && "lg:grid-cols-[4.5rem_minmax(0,1fr)]")}>
      {hasThumbnails ? (
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {images.map((image, index) => {
            const selected = image.url === selectedImage?.url;
            return (
              <button
                key={image.url}
                type="button"
                className={cn(
                  "size-16 shrink-0 overflow-hidden rounded-lg bg-muted outline-none ring-1 ring-foreground/10 transition focus-visible:ring-3 focus-visible:ring-ring/50 lg:size-[4.5rem]",
                  selected && "ring-2 ring-primary",
                )}
                onClick={() => onSelect(image)}
                aria-label={`Show ${productTitle} image ${index + 1}`}
                aria-pressed={selected}
              >
                <img
                  src={image.url}
                  alt=""
                  width={image.width ?? undefined}
                  height={image.height ?? undefined}
                  className="size-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="order-1 overflow-hidden rounded-xl bg-muted lg:order-2">
        {selectedImage ? (
          <img
            src={selectedImage.url}
            alt={selectedImage.altText ?? productTitle}
            width={selectedImage.width ?? undefined}
            height={selectedImage.height ?? undefined}
            className="aspect-square size-full object-cover"
            fetchPriority="high"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">
            Product image unavailable
          </div>
        )}
      </div>
    </div>
  );
}

export { ProductGallery };
