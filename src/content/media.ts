import { photos } from "./photos";

export type SiteImage = { src: string; width: number; height: number };
export type SiteVideo = { src: string; poster: string };
export type ImageKey = keyof typeof photos;
// Client names as written in photos.ts.
export type Client = Extract<(typeof photos)[ImageKey], { client: string }>["client"];

// `?photo` is resolved by the photo plugin in vite.config.ts: the file's URL and its displayed size.
const photoFiles = import.meta.glob<SiteImage>("../assets/photos/*.jpeg", {
  eager: true,
  query: "?photo",
  import: "default",
});

const videoFiles = import.meta.glob<string>("../assets/videos/*.{mp4,jpeg}", {
  eager: true,
  query: "?url",
  import: "default",
});

export const imageKeys = Object.keys(photos).filter((key): key is ImageKey => key in photos);

export function photoFile(key: ImageKey): SiteImage {
  return asset(photoFiles, `../assets/photos/${key}.jpeg`);
}

export const videos = {
  "dennys-kitchen": video("dennys-kitchen"),
  edge: video("edge"),
  handpainted: video("handpainted"),
  "mazda-banner": video("mazda-banner"),
  rebelblue: video("rebelblue"),
  rocomamas: video("rocomamas"),
} satisfies Record<string, SiteVideo>;

export type VideoKey = keyof typeof videos;

function video(name: string): SiteVideo {
  return {
    src: asset(videoFiles, `../assets/videos/${name}.mp4`),
    poster: asset(videoFiles, `../assets/videos/${name}.jpeg`),
  };
}

function asset<T>(files: Record<string, T>, path: string): T {
  const file = files[path];
  if (file === undefined) throw new Error(`missing media file: ${path.replace("../", "src/")}`);
  return file;
}
