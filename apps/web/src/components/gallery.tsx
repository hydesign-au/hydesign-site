import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@hydesign/ui/components/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@hydesign/ui/components/pagination";
import { cn } from "@hydesign/ui/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { Picture } from "@/components/picture";
import { imageAlt, imageLabel, imageMeta, images, type ImageKey } from "@/content";

type GalleryOrientation = "landscape" | "portrait";

type GalleryProps = {
  images: ImageKey[];
  orientation: GalleryOrientation;
  pageSize?: number;
  className?: string;
};

const orientationClasses: Record<GalleryOrientation, string> = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
};

// Photo grid with a click-to-enlarge lightbox. Pagination slices the list in the browser, so
// off-page photos never download. Lightbox nav walks the whole list, not just the page.
function Gallery({ images: keys, orientation, pageSize = 8, className }: GalleryProps) {
  const [page, setPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const pageCount = Math.ceil(keys.length / pageSize);
  const start = page * pageSize;
  const pageKeys = keys.slice(start, start + pageSize);
  // Invisible slots keep the pager from jumping between pages; a single page has
  // no pager, so it ends with its last photo.
  const emptySlots = pageCount > 1 ? Math.max(0, pageSize - pageKeys.length) : 0;

  const active = activeIndex === null ? null : keys[activeIndex];
  const activeIsPortrait = active ? images[active].height > images[active].width : false;

  function selectPage(nextPage: number) {
    if (nextPage === page) return;
    setPage(nextPage);
  }

  function openPhoto(index: number) {
    setActiveIndex(index);
  }

  function step(direction: 1 | -1) {
    if (activeIndex === null) return;

    const next = (activeIndex + direction + keys.length) % keys.length;
    const nextPage = Math.floor(next / pageSize);

    if (nextPage !== page) {
      setPage(nextPage);
    }
    setActiveIndex(next);
  }

  return (
    <div className={className}>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {pageKeys.map((key, index) => (
          <li key={key}>
            <button
              type="button"
              onClick={() => openPhoto(start + index)}
              className={cn(
                "group block w-full cursor-pointer overflow-hidden rounded-panel bg-muted shadow-surface ring-1 ring-glass-border inset-shadow-glass focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                orientationClasses[orientation],
              )}
            >
              <Picture image={key} className="motion-media size-full object-cover" />
            </button>
          </li>
        ))}
        {Array.from({ length: emptySlots }, (_, index) => (
          <li
            key={`empty-${page}-${index}`}
            aria-hidden="true"
            className={cn("invisible", orientationClasses[orientation])}
          />
        ))}
      </ul>

      {pageCount > 1 ? (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={page === 0}
                className={cn(page === 0 && "pointer-events-none opacity-50")}
                onClick={(event) => {
                  event.preventDefault();
                  selectPage(Math.max(0, page - 1));
                }}
              />
            </PaginationItem>
            {pageRange(page, pageCount).map((entry, index) =>
              entry === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={entry}>
                  <PaginationLink
                    href="#"
                    isActive={entry === page}
                    onClick={(event) => {
                      event.preventDefault();
                      selectPage(entry);
                    }}
                  >
                    {entry + 1}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={page === pageCount - 1}
                className={cn(page === pageCount - 1 && "pointer-events-none opacity-50")}
                onClick={(event) => {
                  event.preventDefault();
                  selectPage(Math.min(pageCount - 1, page + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden p-0 sm:w-[min(92vw,72rem)] sm:max-w-[min(92vw,72rem)]"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") step(1);
            if (event.key === "ArrowLeft") step(-1);
          }}
        >
          {active ? (
            <figure className="grid max-h-[calc(100svh-1rem)] w-full grid-rows-[minmax(0,1fr)_auto] overflow-hidden sm:max-h-[calc(100svh-3rem)]">
              <DialogTitle className="sr-only">{imageAlt(active)}</DialogTitle>
              <DialogDescription className="sr-only">
                Photo {(activeIndex ?? 0) + 1} of {keys.length}
              </DialogDescription>
              <div className="relative grid min-h-0 place-items-center bg-muted">
                <div
                  className={cn(
                    "grid place-items-center",
                    activeIsPortrait
                      ? "aspect-[3/4] w-[min(100%,calc(75svh-4.5rem))] sm:w-[min(100%,calc(75svh-6rem))]"
                      : "aspect-[4/3] w-[min(100%,calc(133.333svh-8rem))] sm:w-[min(100%,calc(133.333svh-10.667rem))]",
                  )}
                >
                  <Picture
                    key={active}
                    image={active}
                    sizes="90vw"
                    loading="eager"
                    className="size-full object-contain"
                  />
                </div>
                <DialogClose
                  render={
                    <button
                      type="button"
                      aria-label="Close photo"
                      className="absolute top-3 right-3 grid size-9 place-items-center rounded-full border border-glass-border bg-glass text-glass-foreground shadow-glass inset-shadow-glass backdrop-blur-glass transition-colors hover:bg-popover focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    />
                  }
                >
                  <XIcon className="size-4" />
                </DialogClose>
                {keys.length > 1 ? (
                  <>
                    <NavButton side="left" onClick={() => step(-1)} />
                    <NavButton side="right" onClick={() => step(1)} />
                  </>
                ) : null}
              </div>
              <figcaption className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span className="font-medium">{imageLabel(active)}</span>
                {imageMeta[active].location ? (
                  <span className="text-muted-foreground">{imageMeta[active].location}</span>
                ) : null}
              </figcaption>
            </figure>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full border border-glass-border bg-glass text-glass-foreground shadow-glass inset-shadow-glass backdrop-blur-glass transition-colors hover:bg-popover focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}

// Page numbers around the current page with ellipses for the gaps: 1 … 4 5 6 … 12.
function pageRange(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index);

  const result: Array<number | "ellipsis"> = [];
  let previous = -1;
  for (let page = 0; page < total; page++) {
    const keep = page === 0 || page === total - 1 || Math.abs(page - current) <= 1;
    if (!keep) continue;
    if (page - previous > 1) result.push("ellipsis");
    result.push(page);
    previous = page;
  }
  return result;
}

export { Gallery };
