import { describe, expect, test } from "vitest";

import type { MediaFolder, MediaItem } from "@/api";
import {
  counts,
  folderScope,
  itemProject,
  itemTitle,
  matchesView,
  searchItems,
  sortItems,
} from "@/lib/views";

const folders: MediaFolder[] = [
  {
    slug: "illuminated-signage",
    label: "Illuminated Signage",
    parent: null,
    depth: 0,
    path: "Illuminated Signage",
  },
  {
    slug: "neon",
    label: "Neon",
    parent: "illuminated-signage",
    depth: 1,
    path: "Illuminated Signage / Neon",
  },
  { slug: "projects", label: "Projects", parent: null, depth: 0, path: "Projects" },
  {
    slug: "rocomamas",
    label: "RocoMamas",
    parent: "projects",
    depth: 1,
    path: "Projects / RocoMamas",
  },
];

describe("folder views", () => {
  test("includes descendant assets in a selected folder", () => {
    expect([...folderScope(folders, "illuminated-signage")]).toEqual([
      "illuminated-signage",
      "neon",
    ]);
    expect(
      matchesView(
        item({ folders: ["neon"] }),
        { kind: "folder", value: "illuminated-signage" },
        folders,
      ),
    ).toBe(true);
  });

  test("counts folder descendants once per asset", () => {
    const result = counts(
      [
        item({ id: "one", folders: ["illuminated-signage", "neon"] }),
        item({ id: "two", folders: ["neon"] }),
      ],
      folders,
    );

    expect(result.folders["illuminated-signage"]).toBe(2);
    expect(result.folders["neon"]).toBe(2);
  });

  test("sorts known capture dates ahead of the dump", () => {
    const older = item({ id: "older", capturedAt: "2023-05-01T00:00:00.000Z" });
    const newer = item({ id: "newer", capturedAt: "2024-07-10T00:00:00.000Z" });
    const dump = item({ id: "dump", capturedAt: null });

    expect(sortItems([older, dump, newer], "capturedNewest").map(({ id }) => id)).toEqual([
      "newer",
      "older",
      "dump",
    ]);
    expect(sortItems([newer, dump, older], "capturedOldest").map(({ id }) => id)).toEqual([
      "older",
      "newer",
      "dump",
    ]);
  });

  test("searches folder paths and captured month", () => {
    const subject = item({
      folders: ["rocomamas"],
      capturedAt: "2023-07-10T00:00:00.000Z",
    });

    expect(searchItems([subject], "projects rocomamas", folders)).toHaveLength(1);
    expect(searchItems([subject], "july 2023", folders)).toHaveLength(1);
  });

  test("derives the project label from the Projects folder", () => {
    const projectItem = item({ file: "2023/07/IMG_0001.jpeg", folders: ["rocomamas"] });
    const unfiledItem = item({ file: "2023/07/IMG_0002.jpeg" });

    expect(itemProject(projectItem, folders)).toBe("RocoMamas");
    expect(itemTitle(projectItem, folders)).toBe("RocoMamas");
    expect(itemProject(unfiledItem, folders)).toBe("");
    expect(itemTitle(unfiledItem, folders)).toBe("IMG_0002.jpeg");
  });
});

function item(overrides: Partial<MediaItem> = {}): MediaItem {
  return {
    id: "IMG_0001",
    type: "photo",
    file: "IMG_0001.jpeg",
    path: "media/IMG_0001.jpeg",
    bytes: 0,
    mime: "image/jpeg",
    width: 4032,
    height: 3024,
    orientation: "landscape",
    durationSeconds: null,
    posterFile: null,
    location: "Windsor",
    folders: [],
    exif: null,
    capturedAt: null,
    ...overrides,
  };
}
