import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { Picture } from "@/components/picture";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { imageAlt, imageLabel, imageLocation, photoFile, type ImageKey } from "@/content";
import { cn } from "@/lib/utils";

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
  const activeFile = active ? photoFile(active) : null;
  const activeIsPortrait = activeFile ? activeFile.height > activeFile.width : false;

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
      <ul
        key={page}
        className="grid grid-cols-2 gap-3 motion-safe:animate-content-in sm:gap-4 lg:grid-cols-4"
      >
        {pageKeys.map((key, index) => (
          <li key={key}>
            <button
              type="button"
              onClick={() => openPhoto(start + index)}
              className={cn(
                "group block w-full cursor-pointer overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-border focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                orientationClasses[orientation],
              )}
            >
              <Picture
                image={key}
                className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.035] motion-safe:group-focus-within:scale-[1.035] size-full object-cover"
              />
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
          className={cn(
            "w-[min(calc(100vw-1rem),calc((100svh-4rem)*var(--photo-ratio)))] max-w-none gap-0 overflow-hidden p-0 sm:w-[min(92vw,72rem,calc((100svh-6rem)*var(--photo-ratio)))] sm:max-w-none",
            activeIsPortrait ? "[--photo-ratio:0.75]" : "[--photo-ratio:1.333333]",
          )}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") step(1);
            if (event.key === "ArrowLeft") step(-1);
          }}
        >
          {active ? (
            <figure className="grid w-full">
              <DialogTitle className="sr-only">{imageAlt(active)}</DialogTitle>
              <DialogDescription className="sr-only">
                Photo {(activeIndex ?? 0) + 1} of {keys.length}
              </DialogDescription>
              <div className="relative aspect-(--photo-ratio) w-full bg-muted [&>picture]:absolute [&>picture]:inset-0">
                <Picture
                  key={active}
                  image={active}
                  sizes="90vw"
                  loading="eager"
                  className="size-full object-cover motion-safe:animate-content-in"
                />
                <DialogClose
                  render={
                    <Button
                      variant="glass"
                      size="icon-lg"
                      aria-label="Close photo"
                      className="absolute top-3 right-3 rounded-full"
                    />
                  }
                >
                  <XIcon />
                </DialogClose>
                {keys.length > 1 ? (
                  <>
                    <NavButton side="left" onClick={() => step(-1)} />
                    <NavButton side="right" onClick={() => step(1)} />
                  </>
                ) : null}
              </div>
              <figcaption className="flex h-12 min-w-0 items-center justify-between gap-4 px-4 text-sm">
                <span className="truncate font-medium">{imageLabel(active)}</span>
                {imageLocation(active) ? (
                  <span className="shrink-0 text-muted-foreground">{imageLocation(active)}</span>
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
    <Button
      variant="glass"
      size="icon-xl"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 rounded-full",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      <Icon />
    </Button>
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
