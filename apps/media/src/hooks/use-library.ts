import { useCallback, useEffect, useState } from "react";

import {
  bulkPatch,
  createFolder as createFolderApi,
  deleteItems,
  fetchLibrary,
  type MediaFolder,
  type MediaItem,
  type MediaLibrary,
  type MediaPatch,
  patchItem,
  removeFolder as removeFolderApi,
  renameFolder as renameFolderApi,
  refreshLibrary,
} from "@/api";

const EMPTY_ITEMS: MediaItem[] = [];
const EMPTY_FOLDERS: MediaFolder[] = [];

// One library in memory. Every write returns the updated resource(s), so we patch
// state in place instead of refetching. `imageVersion` busts the browser cache after
// Refresh sees changed bytes behind the same filename.
export function useLibrary() {
  const [library, setLibrary] = useState<MediaLibrary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageVersion, setImageVersion] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLibrary(await fetchLibrary());
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const mergeItems = useCallback((updated: MediaItem[]) => {
    const byId = new Map(updated.map((item) => [item.id, item]));
    setLibrary((current) =>
      current
        ? { ...current, items: current.items.map((item) => byId.get(item.id) ?? item) }
        : current,
    );
  }, []);

  const save = useCallback(
    async (id: string, patch: MediaPatch) => {
      mergeItems([await patchItem(id, patch)]);
    },
    [mergeItems],
  );

  const saveMany = useCallback(
    async (ids: string[], patch: MediaPatch) => {
      if (ids.length > 0) mergeItems(await bulkPatch(ids, patch));
    },
    [mergeItems],
  );

  const remove = useCallback(async (ids: string[]) => {
    await deleteItems(ids);
    const gone = new Set(ids);
    setLibrary((current) =>
      current ? { ...current, items: current.items.filter((item) => !gone.has(item.id)) } : current,
    );
  }, []);

  const refresh = useCallback(async () => {
    setLibrary(await refreshLibrary());
    setImageVersion((v) => v + 1);
  }, []);

  const createFolder = useCallback(async (label: string, parent: string | null) => {
    const result = await createFolderApi(label, parent);
    setLibrary(result.library);
    return result.slug;
  }, []);
  const renameFolder = useCallback(async (slug: string, label: string) => {
    const result = await renameFolderApi(slug, label);
    setLibrary(result.library);
    return result.slug;
  }, []);
  const removeFolder = useCallback(async (slug: string) => {
    setLibrary(await removeFolderApi(slug));
  }, []);

  return {
    library,
    items: library?.items ?? EMPTY_ITEMS,
    folders: library?.folders ?? EMPTY_FOLDERS,
    error,
    loading,
    imageVersion,
    reload: load,
    save,
    saveMany,
    remove,
    refresh,
    createFolder,
    renameFolder,
    removeFolder,
  };
}
