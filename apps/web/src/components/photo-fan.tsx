import { cn } from "@hydesign/ui/lib/utils";

import { Picture } from "@/components/picture";
import { type PhotoGroup } from "@/content";

type PhotoFanProps = {
  photos: PhotoGroup;
  className?: string;
};

// A spread for each photo count: one print, a pair meeting in the middle or the
// full fan of three.
const fanLayouts = {
  1: { grid: "max-w-sm grid-cols-1", cards: ["-rotate-2"] },
  2: {
    grid: "max-w-3xl grid-cols-2",
    cards: [
      "translate-x-2 -rotate-3 origin-right sm:translate-x-4",
      "relative z-10 -translate-x-2 translate-y-4 rotate-3 origin-left sm:-translate-x-4",
    ],
  },
  3: {
    grid: "max-w-5xl grid-cols-3",
    cards: [
      "translate-x-2 translate-y-4 -rotate-5 origin-right sm:translate-x-[1.4rem]",
      "relative z-10 scale-[1.055]",
      "-translate-x-2 translate-y-4 rotate-5 origin-left sm:-translate-x-[1.4rem]",
    ],
  },
} as const;

function PhotoFan({ photos, className }: PhotoFanProps) {
  const layout = fanLayouts[photos.length];

  return (
    <div
      className={cn(
        "relative left-1/2 grid w-[min(112%,calc(100vw-2rem))] -translate-x-1/2 items-center px-3 pt-6 pb-8",
        layout.grid,
        className,
      )}
    >
      {photos.map((photo, index) => (
        <div key={photo} className="min-w-0">
          <div
            className={cn(
              "relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted ring-1 ring-glass-border",
              layout.cards[index],
            )}
          >
            <Picture image={photo} className="size-full object-cover" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { PhotoFan };
