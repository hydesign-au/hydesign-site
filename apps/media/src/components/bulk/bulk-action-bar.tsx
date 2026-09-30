import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from "@hydesign/ui/components/action-bar";
import { Button } from "@hydesign/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@hydesign/ui/components/field";
import { Input } from "@hydesign/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

import type { MediaFolder, MediaItem, MediaPatch } from "@/api";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { FolderTreeField } from "@/components/inspector/folder-tree-field";

type BulkFormValues = { location: string; folders: string[] };

const emptyValues: BulkFormValues = { location: "", folders: [] };

export function BulkActionBar({
  items,
  folders,
  onApply,
  onDelete,
  onClear,
}: {
  items: MediaItem[];
  folders: MediaFolder[];
  onApply: (patch: MediaPatch) => Promise<void>;
  onDelete: () => void | Promise<void>;
  onClear: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: emptyValues,
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await onApply(patchFromValues(value));
        form.reset();
        setEditing(false);
      } catch (err) {
        setError(String(err));
      }
    },
  });

  if (items.length === 0) return null;

  return (
    <>
      {editing ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-4">
          <form
            className="pointer-events-auto w-full max-w-3xl rounded-lg border bg-card p-3 shadow-lg"
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <FieldGroup className="grid gap-3 md:grid-cols-2">
              <form.Field name="location">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      onChange={(event) => field.handleChange(event.target.value)}
                      placeholder="unchanged"
                      value={field.state.value}
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="folders">
                {(field) => (
                  <Field>
                    <FieldLabel>Replace folders</FieldLabel>
                    <FolderTreeField
                      folders={folders}
                      value={field.state.value}
                      onValueChange={(next) => field.handleChange(next)}
                    />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>

            {error ? <p className="mt-3 text-xs text-destructive">{error}</p> : null}

            <form.Subscribe
              selector={(state) => ({
                enabled: hasEdits(state.values),
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ enabled, isSubmitting }) => (
                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setEditing(false);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!enabled || isSubmitting}>
                    {isSubmitting ? "Applying..." : "Apply"}
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </form>
        </div>
      ) : null}

      <ActionBar
        open={items.length > 0}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(false);
            onClear();
          }
        }}
      >
        <ActionBarSelection>{items.length} selected</ActionBarSelection>
        <ActionBarSeparator />
        <ActionBarGroup>
          <ActionBarItem
            onSelect={(event) => {
              event.preventDefault();
              setEditing((current) => !current);
            }}
          >
            <Pencil />
            Edit
          </ActionBarItem>
          <ConfirmDialog
            title={`Delete ${items.length} media files?`}
            description="This removes the selected media files and metadata from the repo."
            onConfirm={onDelete}
            trigger={
              <ActionBarItem
                className="text-destructive"
                onSelect={(event) => event.preventDefault()}
              >
                <Trash2 />
                Delete
              </ActionBarItem>
            }
          />
          <ActionBarClose aria-label="Clear selection">
            <X />
          </ActionBarClose>
        </ActionBarGroup>
      </ActionBar>
    </>
  );
}

function patchFromValues(value: BulkFormValues): MediaPatch {
  const patch: MediaPatch = {};
  if (value.location.trim()) patch.location = value.location.trim();
  if (value.folders.length > 0) patch.folders = value.folders;
  return patch;
}

function hasEdits(value: BulkFormValues): boolean {
  return value.location.trim().length > 0 || value.folders.length > 0;
}
