import { cn } from "@hydesign/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

import { Picture } from "@/components/picture";
import { type ImageKey } from "@/content";

type PhotoBlurbProps = {
  href: string;
  image: ImageKey;
  title: string;
  subtitle: string;
  // h3 under a section heading (default); h2 when cards sit directly under the page H1.
  headingLevel?: "h2" | "h3";
  // Two-up on phones: a smaller title and no subtitle until there is room for it.
  compact?: boolean;
};

function PhotoBlurb({
  href,
  image,
  title,
  subtitle,
  headingLevel = "h3",
  compact = false,
}: PhotoBlurbProps) {
  const Heading = headingLevel;
  return (
    <article className="rounded-2xl group aspect-[4/3] overflow-hidden bg-photo-scrim shadow-md ring-1 ring-border">
      <Link to={href} className="relative block size-full">
        <div className="size-full overflow-hidden">
          <Picture
            image={image}
            className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.035] motion-safe:group-focus-within:scale-[1.035] size-full object-cover brightness-[0.82] saturate-[0.92]"
          />
        </div>
        <div
          className={cn(
            "text-shadow-photo absolute inset-x-0 bottom-0 bg-gradient-to-t from-photo-scrim/88 via-photo-scrim/50 via-45% to-transparent",
            compact ? "p-3 pt-10 sm:p-5 sm:pt-16" : "p-5 pt-16",
          )}
        >
          <div className="flex items-center gap-2">
            <Heading
              className={cn(
                "min-w-0 font-black leading-tight text-white",
                compact ? "text-base sm:text-xl" : "text-xl",
              )}
            >
              {title}
            </Heading>
            <ArrowRightIcon
              className={cn(
                "motion-safe:transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-within:translate-x-1 size-4 shrink-0 text-primary",
                compact && "hidden sm:block",
              )}
            />
          </div>
          <p
            className={cn(
              "mt-2 line-clamp-2 text-sm leading-6 text-white/80",
              compact && "hidden sm:block",
            )}
          >
            {subtitle}
          </p>
        </div>
      </Link>
    </article>
  );
}

export { PhotoBlurb };
