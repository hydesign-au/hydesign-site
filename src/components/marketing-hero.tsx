import { Link } from "@tanstack/react-router";
import { ArrowDownIcon, ArrowRightIcon, MailIcon, PhoneIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Picture } from "@/components/picture";
import { Button, buttonVariants } from "@/components/ui/button";
import { Video } from "@/components/video";
import { siteSettings, type ImageKey, type SiteVideo } from "@/content";
import { useMediaParallax } from "@/hooks/use-media-parallax";
import { cn } from "@/lib/utils";

import styles from "./marketing-hero.module.css";

type HeroActionBase = {
  label: string;
  kind?: "primary" | "secondary";
  ariaLabel?: string;
  // Defaults to a mail icon on primary actions and an arrow on secondary ones.
  icon?: ReactNode;
};

type HeroAction = HeroActionBase &
  (
    | {
        href: string;
        scrollTargetId?: never;
      }
    | {
        href?: never;
        scrollTargetId: string;
      }
  );

type PhotoHeroFrameBaseProps = {
  title: ReactNode;
  children?: ReactNode;
  actions?: HeroAction[];
  eyebrow?: ReactNode;
  fullScreen?: boolean;
  media?: ReactNode;
  subtitle?: ReactNode;
  variant?: "page" | "home";
};

type PhotoHeroScrollProps =
  | {
      scrollLabel: string;
      scrollTargetId: string;
    }
  | {
      scrollLabel?: undefined;
      scrollTargetId?: undefined;
    };

type PhotoHeroFrameProps = PhotoHeroFrameBaseProps & PhotoHeroScrollProps;

type MarketingHeroProps = {
  title: ReactNode;
  children?: ReactNode;
  actions?: HeroAction[];
  eyebrow?: ReactNode;
  image?: ImageKey;
  subtitle?: ReactNode;
  video?: SiteVideo;
  fullScreen?: boolean;
};

// The phone number as a secondary hero action.
const callHeroAction: HeroAction = {
  href: siteSettings.phoneHref,
  label: siteSettings.phone,
  ariaLabel: `Call ${siteSettings.phone}`,
  kind: "secondary",
  icon: <PhoneIcon data-icon="inline-end" />,
};

function PhotoHeroFrame({
  actions,
  children,
  eyebrow,
  fullScreen,
  media,
  scrollLabel,
  scrollTargetId,
  subtitle,
  title,
  variant = "page",
}: PhotoHeroFrameProps) {
  const parallaxRef = useMediaParallax();
  const isHomeHero = variant === "home";
  const actionSize = isHomeHero || fullScreen ? "lg" : "default";

  return (
    <section
      data-photo-hero
      className={cn(
        // Photos keep the dark theme in both modes.
        "dark relative isolate text-white",
        isHomeHero && styles.home,
        !isHomeHero && "min-h-[min(38rem,100svh)] md:min-h-[min(42rem,100svh)]",
        fullScreen && "min-h-svh md:min-h-svh",
      )}
    >
      {/* Phones and tablets keep the photo full width. On desktop it is a panel set in from the
          page edge, so it ends in a rounded edge rather than a hard line. Only the panel is inset:
          the copy keeps the page's content column. */}
      <div className="absolute inset-0 overflow-hidden bg-photo-scrim lg:inset-3 lg:rounded-2xl">
        {media ? (
          <div
            ref={parallaxRef}
            className="absolute inset-x-0 -top-[15%] h-[140%] opacity-80 will-change-transform"
          >
            {media}
          </div>
        ) : null}
        {/* The copy sits left and low, so the scrim darkens that corner and leaves the rest of the
            photo clear. On phones the copy spans the full width, so the right side keeps some
            scrim. The top band keeps the header readable before it picks up its glass. */}
        <div className="absolute inset-0 bg-gradient-to-r from-photo-scrim/80 via-photo-scrim/55 via-42% to-photo-scrim/30 to-80% md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-photo-scrim/55 to-transparent to-50%" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-photo-scrim/60 to-transparent" />
      </div>

      <div
        className={cn(
          "relative z-10 site-container",
          styles.content,
          isHomeHero
            ? "grid min-h-svh pb-24 pt-28 lg:items-end lg:pb-20"
            : "flex min-h-[min(38rem,100svh)] flex-col justify-center pb-12 pt-24 md:min-h-[min(42rem,100svh)] md:pt-28",
          fullScreen && "min-h-svh md:min-h-svh",
        )}
      >
        <div className={isHomeHero ? "max-w-3xl self-end" : "max-w-4xl"}>
          {eyebrow ? (
            <p className="mb-3 font-cursive text-3xl font-bold leading-none text-primary md:text-4xl">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={cn(
              "text-shadow-photo font-black leading-none",
              styles.title,
              isHomeHero ? "text-5xl md:text-7xl lg:text-8xl" : "text-4xl md:text-6xl lg:text-7xl",
            )}
          >
            {title}
          </h1>
          {children || subtitle ? (
            <div
              className={cn(
                "text-shadow-photo text-white/80",
                styles.description,
                "mt-6 grid max-w-3xl gap-4 text-lg leading-8 md:text-xl md:leading-9",
              )}
            >
              {children}
              {subtitle ? <p>{subtitle}</p> : null}
            </div>
          ) : null}
          <HeroActions actions={actions} size={actionSize} />
        </div>
      </div>

      {scrollTargetId ? (
        <Button
          type="button"
          variant="glass"
          size="icon-2xl"
          aria-label={scrollLabel}
          onClick={() => scrollToTarget(scrollTargetId)}
          className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full lg:bottom-8"
        >
          <ArrowDownIcon />
        </Button>
      ) : null}
    </section>
  );
}

function MarketingHero({
  actions,
  children,
  eyebrow,
  fullScreen,
  image,
  subtitle,
  title,
  video,
}: MarketingHeroProps) {
  const media = getHeroMedia({ image, video });

  return (
    <PhotoHeroFrame
      actions={actions}
      eyebrow={eyebrow}
      fullScreen={fullScreen}
      media={media}
      subtitle={subtitle}
      title={title}
    >
      {children}
    </PhotoHeroFrame>
  );
}

function HeroActions({ actions, size }: { actions?: HeroAction[]; size: "default" | "lg" }) {
  if (!actions?.length) return null;

  return (
    <div className={cn("mt-8 flex flex-wrap gap-3", styles.actions)}>
      {actions.map((action) => {
        const variant = action.kind === "secondary" ? "glass" : "default";
        const content = (
          <>
            {action.label}
            {action.icon ??
              (action.kind === "secondary" ? (
                <ArrowRightIcon
                  data-icon="inline-end"
                  className="motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-within/button:translate-x-1"
                />
              ) : (
                <MailIcon data-icon="inline-end" />
              ))}
          </>
        );

        if ("href" in action) {
          return (
            <Link
              key={`${action.href}-${action.label}`}
              to={action.href}
              aria-label={action.ariaLabel}
              className={cn(buttonVariants({ variant, size }), "group")}
            >
              {content}
            </Link>
          );
        }

        return (
          <Button
            key={`${action.scrollTargetId}-${action.label}`}
            aria-label={action.ariaLabel}
            onClick={() => scrollToTarget(action.scrollTargetId)}
            variant={variant}
            size={size}
            className="group"
          >
            {content}
          </Button>
        );
      })}
    </div>
  );
}

function scrollToTarget(targetId: string) {
  document.getElementById(targetId)?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

function getHeroMedia({ image, video }: Pick<MarketingHeroProps, "image" | "video">) {
  if (video) {
    return (
      <Video src={video.src} poster={video.poster} className="absolute inset-0 h-full w-full" />
    );
  }

  if (image) {
    return (
      <Picture
        image={image}
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 size-full object-cover"
      />
    );
  }

  return null;
}

export { callHeroAction, MarketingHero, PhotoHeroFrame, type HeroAction };
