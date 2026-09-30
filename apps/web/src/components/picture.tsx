import { cn } from "@hydesign/ui/lib/utils";

import { imageAlt, images, type ImageKey } from "@/content";

const responsiveWidths = [480, 960, 1440, 1920] as const;
const defaultWidth = 960;

type PictureProps = {
  image: ImageKey;
  alt?: string;
  className?: string;
  sizes?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
};

function Picture({
  image,
  alt,
  className,
  sizes = "100vw",
  loading = "lazy",
  fetchPriority,
}: PictureProps) {
  const source = images[image];
  const sourceSizes = loading === "lazy" ? `auto, ${sizes}` : sizes;
  const widths = imageWidths(source.width);
  const useCloudflareImages = import.meta.env.CLOUDFLARE_IMAGES;

  return (
    <picture>
      {useCloudflareImages ? (
        <source
          type="image/webp"
          srcSet={imageSrcSet(source.src, widths, "webp")}
          sizes={sourceSizes}
        />
      ) : null}
      <img
        src={
          useCloudflareImages
            ? cloudflareImageUrl(source.src, Math.min(defaultWidth, source.width), "jpeg")
            : source.src
        }
        srcSet={useCloudflareImages ? imageSrcSet(source.src, widths, "jpeg") : undefined}
        width={source.width}
        height={source.height}
        alt={alt ?? imageAlt(image)}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={cn("block max-w-full", className)}
      />
    </picture>
  );
}

function imageWidths(sourceWidth: number) {
  return [
    ...responsiveWidths.filter((width) => width < sourceWidth),
    Math.min(sourceWidth, responsiveWidths.at(-1) ?? sourceWidth),
  ].filter((width, index, widths) => widths.indexOf(width) === index);
}

function imageSrcSet(src: string, widths: number[], format: "jpeg" | "webp") {
  return widths.map((width) => `${cloudflareImageUrl(src, width, format)} ${width}w`).join(", ");
}

function cloudflareImageUrl(src: string, width: number, format: "jpeg" | "webp") {
  return `/cdn-cgi/image/fit=scale-down,format=${format},quality=85,width=${width}${src}`;
}

export { Picture };
