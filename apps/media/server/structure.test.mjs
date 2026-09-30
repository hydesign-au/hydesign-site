import { describe, expect, test } from "vitest";

import { groupMediaFiles, photoPath, videoPath } from "./structure.mjs";

describe("structured media paths", () => {
  test("files photos under their EXIF year and month", () => {
    expect(photoPath("IMG_4316.jpeg", "2023-05-20T09:12:00.000Z")).toBe("2023/05/IMG_4316.jpeg");
  });

  test("separates missing-date photos from custom videos", () => {
    expect(photoPath("IMG_0001.jpeg", null)).toBe("dump/IMG_0001.jpeg");
    expect(videoPath("clips/neon.mp4")).toBe("videos/neon.mp4");
  });

  test("allows one video and matching poster to share an id", () => {
    expect(groupMediaFiles(["neon.mp4", "neon.jpeg"])).toEqual([
      { id: "neon", photo: "neon.jpeg", video: "neon.mp4" },
    ]);
  });

  test("rejects duplicate photo ids across directories", () => {
    expect(() => groupMediaFiles(["2023/05/IMG_1.jpeg", "dump/IMG_1.jpeg"])).toThrow(
      'duplicate media id "IMG_1"',
    );
  });
});
