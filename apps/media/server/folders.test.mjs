import { describe, expect, test } from "vitest";

import { createFolder, deleteFolder, renameFolder } from "./folders.mjs";

describe("folder mutations", () => {
  test("creates a child folder with a generated slug", () => {
    const library = sampleLibrary();

    expect(createFolder(library, { label: "Neon", parent: "illuminated-signage" })).toBe("neon");
    expect(library.folders["neon"]).toEqual({
      label: "Neon",
      parent: "illuminated-signage",
    });
  });

  test("renames a folder slug across children and assets", () => {
    const library = sampleLibrary();
    library.folders.neon = { label: "Neon", parent: "illuminated-signage" };
    library.folders.led = { label: "LED Neon", parent: "neon" };
    library.items.photo.folders = ["neon", "led"];

    expect(renameFolder(library, "neon", "Neon Signs")).toBe("neon-signs");
    expect(library.folders["neon-signs"]).toEqual({
      label: "Neon Signs",
      parent: "illuminated-signage",
    });
    expect(library.folders.led.parent).toBe("neon-signs");
    expect(library.items.photo.folders).toEqual(["neon-signs", "led"]);
  });

  test("deletes a folder subtree and clears its assignments", () => {
    const library = sampleLibrary();
    library.folders.neon = { label: "Neon", parent: "illuminated-signage" };
    library.folders.led = { label: "LED Neon", parent: "neon" };
    library.items.photo.folders = ["illuminated-signage", "neon", "led"];

    expect(deleteFolder(library, "neon")).toEqual(["neon", "led"]);
    expect(library.folders).toEqual({
      "illuminated-signage": { label: "Illuminated Signage" },
    });
    expect(library.items.photo.folders).toEqual(["illuminated-signage"]);
  });
});

function sampleLibrary() {
  return {
    folders: {
      "illuminated-signage": { label: "Illuminated Signage" },
    },
    items: {
      photo: { folders: [] },
    },
  };
}
