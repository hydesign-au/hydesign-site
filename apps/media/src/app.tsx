import { Alert, AlertDescription, AlertTitle } from "@hydesign/ui/components/alert";
import { Button } from "@hydesign/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@hydesign/ui/components/dropdown-menu";
import { Input } from "@hydesign/ui/components/input";
import { ScrollArea } from "@hydesign/ui/components/scroll-area";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@hydesign/ui/components/sidebar";
import { ArrowUpDown, CircleAlert, RefreshCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { BulkActionBar } from "@/components/bulk/bulk-action-bar";
import { LibraryGrid } from "@/components/library/library-grid";
import { PhotoViewer } from "@/components/viewer/photo-viewer";
import { useLibrary } from "@/hooks/use-library";
import { useSelection } from "@/hooks/use-selection";
import { AppSidebar } from "@/layout/app-sidebar";
import { counts, matchesView, searchItems, type Sort, sortItems, type View } from "@/lib/views";

const PHOTO_ROUTE_PREFIX = "/photos/";

const SORT_LABELS: Record<Sort, string> = {
  capturedNewest: "Newest captured",
  capturedOldest: "Oldest captured",
  name: "File name",
};

function isSort(value: string): value is Sort {
  return value in SORT_LABELS;
}

export function App() {
  const library = useLibrary();
  const selection = useSelection();
  const photoRoute = usePhotoRoute();
  const [view, setView] = useState<View>({ kind: "all" });
  const [sort, setSort] = useState<Sort>("capturedNewest");
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { items, folders, imageVersion } = library;
  const libraryCounts = useMemo(() => counts(items, folders), [items, folders]);

  const searched = useMemo(() => searchItems(items, query, folders), [items, query, folders]);
  const sorted = useMemo(() => sortItems(searched, sort), [searched, sort]);
  const visible = useMemo(
    () => sorted.filter((item) => matchesView(item, view, folders)),
    [sorted, view, folders],
  );
  const order = useMemo(() => visible.map((item) => item.id), [visible]);

  const selected = useMemo(
    () => items.filter((item) => selection.ids.has(item.id)),
    [items, selection.ids],
  );
  const openItem = useMemo(
    () => (photoRoute.id ? (items.find((item) => item.id === photoRoute.id) ?? null) : null),
    [items, photoRoute.id],
  );
  const viewerOrder = useMemo(() => {
    if (!openItem) return order;
    return order.includes(openItem.id) ? order : sorted.map((item) => item.id);
  }, [openItem, order, sorted]);

  function pickView(next: View) {
    setView(next);
    selection.clear();
  }

  async function removeItems(ids: string[]) {
    await library.remove(ids);
    selection.clear();
    if (photoRoute.id && ids.includes(photoRoute.id)) photoRoute.close();
  }

  async function refresh() {
    setRefreshing(true);
    try {
      await library.refresh();
    } finally {
      setRefreshing(false);
    }
  }

  function openMedia(id: string) {
    selection.clear();
    photoRoute.open(id);
  }

  function stepOpen(offset: -1 | 1) {
    if (!openItem || viewerOrder.length === 0) return;
    const current = viewerOrder.indexOf(openItem.id);
    const next = current === -1 ? 0 : (current + offset + viewerOrder.length) % viewerOrder.length;
    photoRoute.open(viewerOrder[next]);
  }

  function select(id: string, event: { metaKey: boolean; ctrlKey: boolean; shiftKey: boolean }) {
    selection.select(id, {
      additive: event.metaKey || event.ctrlKey,
      range: event.shiftKey,
      order,
    });
  }

  if (photoRoute.id && library.loading) {
    return <div className="grid h-screen place-items-center bg-background">Loading media...</div>;
  }

  if (openItem) {
    return (
      <PhotoViewer
        key={openItem.id}
        item={openItem}
        folders={folders}
        imageVersion={imageVersion}
        onPatch={(patch) => library.save(openItem.id, patch)}
        onDelete={() => removeItems([openItem.id])}
        onClose={photoRoute.close}
        onPrevious={() => stepOpen(-1)}
        onNext={() => stepOpen(1)}
      />
    );
  }

  return (
    <SidebarProvider className="h-screen min-h-0 overflow-hidden">
      <div className="flex h-full min-h-0 w-full min-w-0 flex-1 overflow-hidden bg-background text-foreground">
        <AppSidebar
          view={view}
          counts={libraryCounts}
          folders={folders}
          onView={pickView}
          onCreateFolder={library.createFolder}
          onRenameFolder={library.renameFolder}
          onDeleteFolder={library.removeFolder}
        />

        <SidebarInset className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-12 shrink-0 items-center gap-3 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search files, folders, locations..."
                className="pl-8"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
                  <ArrowUpDown />
                  {SORT_LABELS[sort]}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={(value) => {
                      if (isSort(value)) setSort(value);
                    }}
                  >
                    <DropdownMenuRadioItem value="capturedNewest">
                      Newest captured
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="capturedOldest">
                      Oldest captured
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name">File name</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refresh()}
                disabled={refreshing}
              >
                <RefreshCcw />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </header>

          {library.error ? (
            <div className="border-b p-3">
              <Alert variant="destructive">
                <CircleAlert />
                <AlertTitle>Library error</AlertTitle>
                <AlertDescription>{library.error}</AlertDescription>
              </Alert>
            </div>
          ) : null}

          <div className="grid h-full min-h-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full min-h-0 w-full min-w-0 overflow-hidden">
              <main className="min-h-full w-full p-4">
                <LibraryGrid
                  items={visible}
                  folders={folders}
                  selectedIds={selection.ids}
                  activeId={selection.activeId}
                  imageVersion={imageVersion}
                  selectionMode={selection.ids.size > 0}
                  onOpen={openMedia}
                  onSelect={select}
                />
              </main>
            </ScrollArea>
          </div>

          <BulkActionBar
            items={selected}
            folders={folders}
            onApply={(patch) => library.saveMany(Array.from(selection.ids), patch)}
            onClear={selection.clear}
            onDelete={() => removeItems(selected.map((item) => item.id))}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function usePhotoRoute() {
  const [id, setId] = useState(readPhotoRoute);

  useEffect(() => {
    function sync() {
      setId(readPhotoRoute());
    }

    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  function open(nextId: string) {
    window.history.pushState(null, "", `${PHOTO_ROUTE_PREFIX}${encodeURIComponent(nextId)}`);
    setId(nextId);
  }

  function close() {
    window.history.pushState(null, "", "/");
    setId(null);
  }

  return { id, open, close };
}

function readPhotoRoute() {
  if (typeof window === "undefined") return null;
  if (!window.location.pathname.startsWith(PHOTO_ROUTE_PREFIX)) return null;
  const raw = window.location.pathname.slice(PHOTO_ROUTE_PREFIX.length).split("/")[0];
  return raw ? decodeURIComponent(raw) : null;
}
