import { Button } from "@hydesign/ui/components/button";
import { ScrollArea } from "@hydesign/ui/components/scroll-area";
import { cn } from "@hydesign/ui/lib/utils";
import { ChevronLeft, ChevronRight, Info, Trash2, X } from "lucide-react";
import { useState } from "react";

import { mediaUrl, type MediaFolder, type MediaItem, type MediaPatch } from "@/api";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Inspector } from "@/components/inspector/inspector";
import { itemTitle } from "@/lib/views";

export function PhotoViewer({
  item,
  folders,
  imageVersion,
  onPatch,
  onDelete,
  onClose,
  onPrevious,
  onNext,
}: {
  item: MediaItem;
  folders: MediaFolder[];
  imageVersion: number;
  onPatch: (patch: MediaPatch) => Promise<void>;
  onDelete: () => void | Promise<void>;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const [infoOpen, setInfoOpen] = useState(true);

  return (
    <div className="flex h-screen min-h-0 w-full overflow-hidden bg-background text-foreground">
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-photo-surface text-photo-foreground">
        <header className="absolute inset-x-0 top-0 z-20 flex h-14 items-center gap-2 border-b border-photo-border bg-photo-panel px-3 backdrop-blur-glass">
          <Button
            variant="ghost"
            size="icon"
            className="text-photo-foreground hover:bg-photo-foreground/10 hover:text-photo-foreground"
            onClick={onClose}
            aria-label="Back to gallery"
          >
            <X />
          </Button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{itemTitle(item, folders)}</div>
            <div className="truncate text-xs text-photo-muted">{item.file}</div>
          </div>
          <Button
            variant={infoOpen ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              !infoOpen &&
                "text-photo-foreground hover:bg-photo-foreground/10 hover:text-photo-foreground",
            )}
            onClick={() => setInfoOpen((current) => !current)}
          >
            <Info />
            Info
          </Button>
          <ConfirmDialog
            title={`Delete ${item.file}?`}
            description="This removes the media file and its metadata from the repo."
            onConfirm={onDelete}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="text-photo-foreground hover:bg-destructive/20 hover:text-photo-foreground"
                aria-label="Delete media"
              >
                <Trash2 />
              </Button>
            }
          />
        </header>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-3 z-20 text-photo-foreground hover:bg-photo-foreground/10 hover:text-photo-foreground"
          onClick={onPrevious}
          aria-label="Previous media"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-3 z-20 text-photo-foreground hover:bg-photo-foreground/10 hover:text-photo-foreground"
          onClick={onNext}
          aria-label="Next media"
        >
          <ChevronRight />
        </Button>

        <div className="min-h-0 flex-1 pt-14">
          <div className="grid size-full place-items-center p-10">
            {item.type === "video" ? (
              <video
                src={mediaUrl(item.file, imageVersion)}
                poster={item.posterFile ? mediaUrl(item.posterFile, imageVersion) : undefined}
                controls
                playsInline
                className="max-h-full max-w-full bg-photo-surface"
              />
            ) : (
              <img
                src={mediaUrl(item.file, imageVersion)}
                alt={item.file}
                className="max-h-full max-w-full bg-photo-surface object-contain"
              />
            )}
          </div>
        </div>
      </main>

      {infoOpen ? (
        <aside className="h-full w-[380px] shrink-0 border-l bg-background">
          <ScrollArea className="h-full">
            <Inspector
              key={item.id}
              item={item}
              folders={folders}
              imageVersion={imageVersion}
              onPatch={onPatch}
              onDelete={onDelete}
              showPreview={false}
              showDelete={false}
            />
          </ScrollArea>
        </aside>
      ) : null}
    </div>
  );
}
