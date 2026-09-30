import { useCallback, useState } from "react";

// Multi-select over the grid: a Set of ids, plus an anchor for shift-range and an
// active id for the inspector. `order` is the currently visible id list, needed so a
// range select spans what the user actually sees.
export type SelectOptions = { additive?: boolean; range?: boolean; order?: string[] };

export function useSelection() {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [anchor, setAnchor] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const clear = useCallback(() => {
    setIds(new Set());
    setAnchor(null);
    setActiveId(null);
  }, []);

  const select = useCallback(
    (id: string, { additive = false, range = false, order = [] }: SelectOptions = {}) => {
      if (range && anchor) {
        const a = order.indexOf(anchor);
        const b = order.indexOf(id);
        if (a !== -1 && b !== -1) {
          const [lo, hi] = a < b ? [a, b] : [b, a];
          setIds((prev) => new Set([...(additive ? prev : []), ...order.slice(lo, hi + 1)]));
          setActiveId(id);
          setAnchor(id);
          return;
        }
      }

      if (additive) {
        setIds((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          const active = next.has(id) ? id : (next.values().next().value ?? null);
          setActiveId(active);
          setAnchor(active);
          return next;
        });
        return;
      }

      // Plain click on the sole selection clears it — a toggle for single items.
      setIds((prev) => {
        if (prev.size === 1 && prev.has(id)) {
          setActiveId(null);
          setAnchor(null);
          return new Set();
        }
        setActiveId(id);
        setAnchor(id);
        return new Set([id]);
      });
    },
    [anchor],
  );

  // Replace the selection with a single id (used to walk prev/next in the inspector).
  const focus = useCallback((id: string) => {
    setIds(new Set([id]));
    setActiveId(id);
    setAnchor(id);
  }, []);

  return { ids, activeId, select, focus, clear };
}
