import { cn } from "@hydesign/ui/lib/utils";

type VideoProps = {
  src: string;
  poster: string;
  className?: string;
};

/**
 * Silent b-roll used as a page header, in place of the hero photo. Autoplays,
 * loops and shows no controls — it's decorative motion, not a player. Muted and
 * playsInline so browsers allow autoplay (the clips carry no audio anyway). Fills
 * its container like the photo it replaces. The clip and poster come from
 * src/media as hashed URL assets (see content/media.ts).
 */
function Video({ src, poster, className }: VideoProps) {
  return (
    <video
      className={cn("h-full w-full object-cover", className)}
      src={src}
      poster={poster}
      muted
      loop
      autoPlay
      playsInline
      preload="metadata"
    />
  );
}

export { Video };
