import { Button } from "@hydesign/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@hydesign/ui/components/collapsible";
import { Input } from "@hydesign/ui/components/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@hydesign/ui/components/sidebar";
import { cn } from "@hydesign/ui/lib/utils";
import {
  CalendarOff,
  ChevronRight,
  FileImage,
  Folder,
  FolderOpen,
  FolderPlus,
  ImageIcon,
  Layers,
  Pencil,
  Trash2,
  VideoIcon,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import type { MediaFolder } from "@/api";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { LibraryCounts, View } from "@/lib/views";

type Editor = { mode: "create" | "rename"; value: string } | null;

export function AppSidebar({
  view,
  counts,
  folders,
  onView,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
}: {
  view: View;
  counts: LibraryCounts;
  folders: MediaFolder[];
  onView: (view: View) => void;
  onCreateFolder: (label: string, parent: string | null) => Promise<string>;
  onRenameFolder: (slug: string, label: string) => Promise<string>;
  onDeleteFolder: (slug: string) => Promise<void>;
}) {
  const [editor, setEditor] = useState<Editor>(null);
  const selected = view.kind === "folder" ? view.value : null;
  const selectedFolder = folders.find((folder) => folder.slug === selected) ?? null;
  const openFolders = useMemo(() => ancestorSlugs(folders, selected), [folders, selected]);

  async function submitEditor() {
    if (!editor?.value.trim()) return;
    if (editor.mode === "create") {
      const slug = await onCreateFolder(editor.value, selected);
      onView({ kind: "folder", value: slug });
    } else if (selected) {
      const slug = await onRenameFolder(selected, editor.value);
      onView({ kind: "folder", value: slug });
    }
    setEditor(null);
  }

  return (
    <Sidebar className="border-r bg-card/40">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<div />} size="lg">
              <ImageIcon />
              <span className="font-semibold">Media Manager</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ViewItem
                icon={<Layers />}
                label="All files"
                count={counts.all}
                active={view.kind === "all"}
                onClick={() => onView({ kind: "all" })}
              />
              <ViewItem
                icon={<FolderOpen />}
                label="Uncategorized"
                count={counts.unfiled}
                active={view.kind === "unfiled"}
                onClick={() => onView({ kind: "unfiled" })}
              />
              <ViewItem
                icon={<FileImage />}
                label="Photos"
                count={counts.photos}
                active={view.kind === "photos"}
                onClick={() => onView({ kind: "photos" })}
              />
              <ViewItem
                icon={<VideoIcon />}
                label="Videos"
                count={counts.videos}
                active={view.kind === "videos"}
                onClick={() => onView({ kind: "videos" })}
              />
              <ViewItem
                icon={<CalendarOff />}
                label="No capture date"
                count={counts.noExif}
                active={view.kind === "noExif"}
                onClick={() => onView({ kind: "noExif" })}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
        <SidebarGroup>
          <div className="flex items-center gap-1 px-2 pb-2">
            <Button
              variant="outline"
              size="sm"
              className="min-w-0 flex-1"
              onClick={() => setEditor({ mode: "create", value: "" })}
            >
              <FolderPlus />
              New folder
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={!selectedFolder}
              onClick={() =>
                selectedFolder && setEditor({ mode: "rename", value: selectedFolder.label })
              }
              aria-label="Rename selected folder"
            >
              <Pencil />
            </Button>
            {selectedFolder ? (
              <ConfirmDialog
                title={`Delete ${selectedFolder.label}?`}
                description="This deletes the folder and its subfolders. Media files stay in the library."
                onConfirm={async () => {
                  await onDeleteFolder(selectedFolder.slug);
                  onView({ kind: "all" });
                }}
                trigger={
                  <Button variant="outline" size="icon-sm" aria-label="Delete selected folder">
                    <Trash2 />
                  </Button>
                }
              />
            ) : (
              <Button variant="outline" size="icon-sm" disabled aria-label="Delete selected folder">
                <Trash2 />
              </Button>
            )}
          </div>

          {editor ? (
            <form
              className="flex gap-1 px-2 pb-2"
              onSubmit={(event) => {
                event.preventDefault();
                void submitEditor();
              }}
            >
              <Input
                autoFocus
                value={editor.value}
                onChange={(event) =>
                  setEditor((current) =>
                    current ? { ...current, value: event.target.value } : null,
                  )
                }
                placeholder={editor.mode === "create" ? "Folder name" : "New name"}
                className="h-8"
              />
              <Button type="submit" size="sm" disabled={!editor.value.trim()}>
                Save
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditor(null)}>
                Cancel
              </Button>
            </form>
          ) : null}

          <SidebarGroupLabel>Folders</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {folders
                .filter((folder) => folder.parent === null)
                .map((folder) => (
                  <FolderItem
                    key={folder.slug}
                    folder={folder}
                    folders={folders}
                    counts={counts}
                    selected={selected}
                    openFolders={openFolders}
                    onView={onView}
                  />
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function FolderItem({
  folder,
  folders,
  counts,
  selected,
  openFolders,
  onView,
  nested = false,
}: {
  folder: MediaFolder;
  folders: MediaFolder[];
  counts: LibraryCounts;
  selected: string | null;
  openFolders: Set<string>;
  onView: (view: View) => void;
  nested?: boolean;
}) {
  const children = folders.filter((candidate) => candidate.parent === folder.slug);
  const [open, setOpen] = useState(openFolders.has(folder.slug));
  const active = selected === folder.slug;
  const count = counts.folders[folder.slug] ?? 0;
  const select = () => onView({ kind: "folder", value: folder.slug });
  const chevron = children.length ? (
    <ChevronRight className={cn("ml-auto transition-transform", open && "rotate-90")} />
  ) : null;

  if (!children.length) {
    return nested ? (
      <SidebarMenuSubItem className="group/menu-item">
        <SidebarMenuSubButton
          render={<button type="button" />}
          size="sm"
          isActive={active}
          onClick={select}
          className="peer/menu-button w-full pr-8"
        >
          <Folder />
          <span>{folder.label}</span>
        </SidebarMenuSubButton>
        <SidebarMenuBadge className="top-1">{count}</SidebarMenuBadge>
      </SidebarMenuSubItem>
    ) : (
      <SidebarMenuItem>
        <SidebarMenuButton size="sm" isActive={active} onClick={select} className="pr-8">
          <Folder />
          <span>{folder.label}</span>
        </SidebarMenuButton>
        <SidebarMenuBadge>{count}</SidebarMenuBadge>
      </SidebarMenuItem>
    );
  }

  const childrenMenu = (
    <SidebarMenuSub>
      {children.map((child) => (
        <FolderItem
          key={child.slug}
          folder={child}
          folders={folders}
          counts={counts}
          selected={selected}
          openFolders={openFolders}
          onView={onView}
          nested
        />
      ))}
    </SidebarMenuSub>
  );

  return nested ? (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      render={<SidebarMenuSubItem className="group/menu-item" />}
    >
      <CollapsibleTrigger
        render={
          <SidebarMenuSubButton
            render={<button type="button" />}
            size="sm"
            isActive={active}
            onClick={select}
            className="peer/menu-button w-full pr-8"
          />
        }
      >
        <Folder />
        <span>{folder.label}</span>
        {chevron}
      </CollapsibleTrigger>
      <SidebarMenuBadge className="top-1">{count}</SidebarMenuBadge>
      <CollapsibleContent>{childrenMenu}</CollapsibleContent>
    </Collapsible>
  ) : (
    <Collapsible open={open} onOpenChange={setOpen} render={<SidebarMenuItem />}>
      <CollapsibleTrigger
        render={<SidebarMenuButton size="sm" isActive={active} onClick={select} className="pr-8" />}
      >
        <Folder />
        <span>{folder.label}</span>
        {chevron}
      </CollapsibleTrigger>
      <SidebarMenuBadge>{count}</SidebarMenuBadge>
      <CollapsibleContent>{childrenMenu}</CollapsibleContent>
    </Collapsible>
  );
}

function ancestorSlugs(folders: MediaFolder[], selected: string | null) {
  const result = new Set<string>();
  const bySlug = new Map(folders.map((folder) => [folder.slug, folder]));
  let current = selected ? bySlug.get(selected) : undefined;
  while (current) {
    result.add(current.slug);
    current = current.parent ? bySlug.get(current.parent) : undefined;
  }
  return result;
}

function ViewItem({
  icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={active} onClick={onClick}>
        {icon}
        <span>{label}</span>
      </SidebarMenuButton>
      {count > 0 ? <SidebarMenuBadge>{count}</SidebarMenuBadge> : null}
    </SidebarMenuItem>
  );
}
