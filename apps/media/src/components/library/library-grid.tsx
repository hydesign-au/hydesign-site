import { Card, CardDescription, CardTitle } from "@hydesign/ui/components/card";
import { ImageIcon } from "lucide-react";

import type { MediaFolder, MediaItem } from "@/api";
import { MediaTile, type TileSelectEvent } from "@/components/library/media-tile";

export function LibraryGrid({
  items,
  folders,
  selectedIds,
  activeId,
  imageVersion,
  selectionMode,
  onOpen,
  onSelect,
}: {
  items: MediaItem[];
  folders: MediaFolder[];
  selectedIds: Set<string>;
  activeId: string | null;
  imageVersion: number;
  selectionMode: boolean;
  onOpen: (id: string) => void;
  onSelect: (id: string, event: TileSelectEvent) => void;
}) {
  if (items.length === 0) {
    return (
      <Card className="grid min-h-72 w-full place-items-center border-dashed shadow-none">
        <div className="max-w-sm text-center">
          <ImageIcon className="mx-auto mb-3 size-9 text-muted-foreground" />
          <CardTitle className="text-base">No media found</CardTitle>
          <CardDescription className="mt-2">
            Change the filter or import files into the library.
          </CardDescription>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] items-start gap-3">
      {items.map((item) => (
        <MediaTile
          key={item.id}
          item={item}
          folders={folders}
          selected={selectedIds.has(item.id)}
          showMark={selectionMode}
          active={activeId === item.id}
          imageVersion={imageVersion}
          selectionMode={selectionMode}
          onOpen={() => onOpen(item.id)}
          onSelect={(event) => onSelect(item.id, event)}
        />
      ))}
    </div>
  );
}
