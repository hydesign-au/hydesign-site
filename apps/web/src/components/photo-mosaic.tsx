import { cn } from "@hydesign/ui/lib/utils";

import { Picture } from "@/components/picture";
import { type PhotoGroup } from "@/content";

type PhotoMosaicProps = {
  photos: PhotoGroup;
  className?: string;
};

// A layout for each photo count: one photo, two side by side or the offset
// mosaic of three.
const mosaicLayouts = {
  1: { grid: "grid", tiles: ["aspect-[4/3]"] },
  2: { grid: "grid grid-cols-2 gap-2 sm:gap-3", tiles: ["aspect-[4/3]", "aspect-[4/3]"] },
  3: {
    grid: "grid aspect-[5/4] grid-cols-12 grid-rows-12 gap-2 sm:gap-3",
    tiles: [
      "col-span-8 row-span-7",
      "col-start-9 col-span-4 row-start-3 row-span-5",
      "col-start-3 col-span-8 row-start-8 row-span-5",
    ],
  },
} as const;

function PhotoMosaic({ photos, className }: PhotoMosaicProps) {
  const layout = mosaicLayouts[photos.length];

  return (
    <div className={cn(layout.grid, className)}>
      {photos.map((photo, index) => (
        <div
          key={photo}
          className={cn(
            "overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-border",
            layout.tiles[index],
          )}
        >
          <Picture image={photo} className="size-full object-cover" />
        </div>
      ))}
    </div>
  );
}

export { PhotoMosaic };
