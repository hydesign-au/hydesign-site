import { Button } from "@hydesign/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@hydesign/ui/components/field";
import { Input } from "@hydesign/ui/components/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@hydesign/ui/components/tooltip";
import { cn } from "@hydesign/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Info, Trash2 } from "lucide-react";
import { useState } from "react";

import { mediaUrl, type MediaFolder, type MediaItem, type MediaPatch } from "@/api";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ExifPanel } from "@/components/inspector/exif-panel";
import { FolderTreeField } from "@/components/inspector/folder-tree-field";
import { itemProject } from "@/lib/views";

type InspectorFormValues = {
  location: string;
  folders: string[];
};

export function Inspector({
  item,
  folders,
  imageVersion,
  onPatch,
  onDelete,
  showPreview = true,
  showDelete = true,
  className,
}: {
  item: MediaItem;
  folders: MediaFolder[];
  imageVersion: number;
  onPatch: (patch: MediaPatch) => Promise<void>;
  onDelete: () => void | Promise<void>;
  showPreview?: boolean;
  showDelete?: boolean;
  className?: string;
}) {
  const isPhoto = item.type === "photo";
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: formValuesFromItem(item),
    onSubmit: async ({ value }) => {
      const patch = patchFromValues(value);
      if (samePatch(patch, patchFromItem(item))) return;

      setError(null);
      try {
        await onPatch(patch);
      } catch (err) {
        setError(String(err));
      }
    },
  });

  const submit = () => {
    void form.handleSubmit();
  };

  return (
    <div className={cn("flex flex-col gap-4 p-4", className)}>
      {showPreview ? (
        <div className="overflow-hidden rounded-lg border bg-background">
          {isPhoto ? (
            <img
              src={mediaUrl(item.file, imageVersion)}
              alt={item.file}
              className="max-h-72 w-full bg-muted object-contain"
            />
          ) : (
            <video
              src={mediaUrl(item.file, imageVersion)}
              poster={item.posterFile ? mediaUrl(item.posterFile, imageVersion) : undefined}
              controls
              playsInline
              className="max-h-72 w-full bg-muted object-contain"
            />
          )}
        </div>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <FieldGroup>
          <Field data-disabled>
            <div className="flex items-center gap-1">
              <FieldLabel htmlFor="project">Project</FieldLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label="About project"
                      />
                    }
                  >
                    <Info />
                  </TooltipTrigger>
                  <TooltipContent>Derived from the assigned folder under Projects.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="project"
              value={itemProject(item, folders)}
              placeholder="No project folder"
              disabled
            />
          </Field>
          <form.Field name="location">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={() => {
                    field.handleBlur();
                    submit();
                  }}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="folders">
            {(field) => (
              <Field>
                <FieldLabel>Folders</FieldLabel>
                <FolderTreeField
                  folders={folders}
                  value={field.state.value}
                  onValueChange={(next) => {
                    field.handleChange(next);
                    submit();
                  }}
                />
              </Field>
            )}
          </form.Field>
        </FieldGroup>
      </form>

      <ExifPanel item={item} />

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      {showDelete ? (
        <div className="sticky bottom-0 -mx-4 mt-2 flex justify-end border-t bg-card/95 p-4 backdrop-blur">
          <ConfirmDialog
            title={`Delete ${item.file}?`}
            description="This removes the media file and its metadata from the repo."
            onConfirm={onDelete}
            trigger={
              <Button variant="outline" className="ml-auto text-destructive">
                <Trash2 />
                Delete
              </Button>
            }
          />
        </div>
      ) : null}
    </div>
  );
}

function formValuesFromItem(item: MediaItem): InspectorFormValues {
  return {
    location: item.location,
    folders: item.folders,
  };
}

function patchFromItem(item: MediaItem): MediaPatch {
  return patchFromValues(formValuesFromItem(item));
}

function patchFromValues(value: InspectorFormValues): MediaPatch {
  return {
    location: value.location.trim(),
    folders: value.folders,
  };
}

function samePatch(a: MediaPatch, b: MediaPatch): boolean {
  return a.location === b.location && sameStringArray(a.folders, b.folders);
}

function sameStringArray(a: string[] | undefined, b: string[] | undefined): boolean {
  if (!a || !b) return a === b;
  return a.length === b.length && a.every((value, index) => value === b[index]);
}
