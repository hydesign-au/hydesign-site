import { Badge } from "@hydesign/ui/components/badge";
import { Card } from "@hydesign/ui/components/card";
import { cn } from "@hydesign/ui/lib/utils";
import { Check, RectangleVertical } from "lucide-react";

import { mediaUrl, type MediaFolder, type MediaItem } from "@/api";
import { itemTitle } from "@/lib/views";

export type TileSelectEvent = { metaKey: boolean; ctrlKey: boolean; shiftKey: boolean };

// Each tile reserves one responsive landscape slot. Portrait photos remain
// centred when their card leaves horizontal space.
export function MediaTile({
  item,
  folders,
  selected,
  showMark,
  active,
  imageVersion,
  selectionMode,
  onOpen,
  onSelect,
}: {
  item: MediaItem;
  folders: MediaFolder[];
  selected: boolean;
  showMark: boolean;
  active: boolean;
  imageVersion: number;
  selectionMode: boolean;
  onOpen: () => void;
  onSelect: (event: TileSelectEvent) => void;
}) {
  const preview = item.type === "video" ? item.posterFile || item.file : item.file;
  const title = itemTitle(item, folders);
  const subtitle = item.location;
  const duration = item.type === "video" ? durationLabel(item.durationSeconds) : "";
  const orientation = item.orientation;

  return (
    <div className="flex aspect-[4/3] w-full items-start justify-center">
      <Card
        data-selected={selected}
        data-active={active}
        className={cn(
          "h-full flex-none gap-0 overflow-hidden py-0 shadow-sm transition hover:border-ring data-[active=true]:border-primary data-[selected=true]:ring-2 data-[selected=true]:ring-primary",
          orientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]",
        )}
      >
        <button
          type="button"
          onClick={(event) => {
            const selectIntent = selectionMode || event.metaKey || event.ctrlKey || event.shiftKey;
            if (selectIntent) {
              onSelect({
                metaKey: event.metaKey,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
              });
              return;
            }
            onOpen();
          }}
          className="group flex h-full flex-col text-left"
        >
          <div className="relative size-full overflow-hidden bg-muted">
            {item.type === "video" && !item.posterFile ? (
              <video
                src={mediaUrl(item.file, imageVersion)}
                muted
                preload="metadata"
                className="size-full object-cover"
              />
            ) : item.type === "photo" ? (
              <img
                src={mediaUrl(item.file, imageVersion)}
                alt={title}
                loading="lazy"
                className="size-full object-cover transition duration-150"
              />
            ) : (
              <img
                src={mediaUrl(preview, imageVersion)}
                alt={title}
                loading="lazy"
                className="size-full object-contain transition duration-150"
              />
            )}

            {item.type === "photo" && orientation === "portrait" ? (
              <Badge
                variant="secondary"
                className="absolute top-2 left-2 size-5 px-0 shadow-sm"
                aria-label="Portrait photo"
                title="Portrait photo"
              >
                <RectangleVertical />
              </Badge>
            ) : null}

            {showMark ? (
              <span
                data-selected={selected}
                className="absolute top-2 right-2 grid size-6 place-items-center rounded-full border border-border bg-background text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 data-[selected=true]:border-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:opacity-100 [&>svg]:size-3.5"
              >
                <Check />
              </span>
            ) : null}

            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/95 to-transparent p-2 pt-8">
              <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">{title}</div>
                  {subtitle ? (
                    <div className="truncate text-[11px] text-muted-foreground">{subtitle}</div>
                  ) : null}
                </div>
                {duration ? (
                  <div className="shrink-0 text-[11px] font-medium tabular-nums text-foreground/90">
                    {duration}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </button>
      </Card>
    </div>
  );
}

function durationLabel(seconds: number | null) {
  if (!seconds) return "";
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
