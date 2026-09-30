import { Button } from "@hydesign/ui/components/button";
import { Checkbox } from "@hydesign/ui/components/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@hydesign/ui/components/collapsible";
import { Field, FieldLabel } from "@hydesign/ui/components/field";
import { ScrollArea } from "@hydesign/ui/components/scroll-area";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { useId, useState } from "react";

import type { MediaFolder } from "@/api";
import { orderedFolders } from "@/lib/views";

export function FolderTreeField({
  folders,
  value,
  onValueChange,
}: {
  folders: MediaFolder[];
  value: string[];
  onValueChange: (value: string[]) => void;
}) {
  const selected = new Set(value);
  const idPrefix = useId();

  function toggle(slug: string, checked: boolean) {
    const next = checked ? [...value, slug] : value.filter((candidate) => candidate !== slug);
    onValueChange(orderedFolders(folders, [...new Set(next)]));
  }

  return (
    <ScrollArea className="h-72 rounded-md border">
      <div className="flex flex-col p-1" role="tree" aria-label="Folders">
        {folders
          .filter((folder) => folder.parent === null)
          .map((folder) => (
            <FolderNode
              key={folder.slug}
              folder={folder}
              folders={folders}
              selected={selected}
              idPrefix={idPrefix}
              onToggle={toggle}
            />
          ))}
      </div>
    </ScrollArea>
  );
}

function FolderNode({
  folder,
  folders,
  selected,
  idPrefix,
  onToggle,
}: {
  folder: MediaFolder;
  folders: MediaFolder[];
  selected: Set<string>;
  idPrefix: string;
  onToggle: (slug: string, checked: boolean) => void;
}) {
  const children = folders.filter((candidate) => candidate.parent === folder.slug);
  const containsSelection = branchContainsSelection(folders, folder.slug, selected);
  const [open, setOpen] = useState(containsSelection);
  const id = `${idPrefix}-${folder.slug}`;
  const row = (
    <div
      className="flex min-w-0 items-center gap-0.5 rounded-md px-0.5 hover:bg-muted"
      style={{ paddingLeft: folder.depth * 8 + 2 }}
      role="treeitem"
      aria-level={folder.depth + 1}
      aria-expanded={children.length ? open : undefined}
    >
      {children.length ? (
        <CollapsibleTrigger
          render={<Button variant="ghost" size="icon-xs" />}
          aria-label={`Toggle ${folder.label}`}
        >
          {open ? <ChevronDown /> : <ChevronRight />}
        </CollapsibleTrigger>
      ) : (
        <span className="size-6 shrink-0" />
      )}
      <Field orientation="horizontal" className="min-w-0 flex-1 gap-1.5">
        <Checkbox
          id={id}
          checked={selected.has(folder.slug)}
          onCheckedChange={(checked) => onToggle(folder.slug, checked)}
        />
        <FieldLabel htmlFor={id} className="min-w-0 cursor-pointer text-xs font-normal">
          <Folder className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{folder.label}</span>
        </FieldLabel>
      </Field>
    </div>
  );

  if (!children.length) return row;
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      {row}
      <CollapsibleContent>
        {children.map((child) => (
          <FolderNode
            key={child.slug}
            folder={child}
            folders={folders}
            selected={selected}
            idPrefix={idPrefix}
            onToggle={onToggle}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function branchContainsSelection(
  folders: MediaFolder[],
  slug: string,
  selected: Set<string>,
): boolean {
  return (
    selected.has(slug) ||
    folders
      .filter((folder) => folder.parent === slug)
      .some((folder) => branchContainsSelection(folders, folder.slug, selected))
  );
}
