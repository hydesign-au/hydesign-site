import { buttonVariants } from "@hydesign/ui/components/button";
import { NoiseTexture } from "@hydesign/ui/components/noise-texture";
import { cn } from "@hydesign/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, PhoneIcon } from "lucide-react";

import { MotionReveal } from "@/components/motion-reveal";
import { NeonPhone } from "@/components/neon/neon-phone";
import { Picture } from "@/components/picture";
import { siteSettings } from "@/content";

const routesWithoutSiteOutro = new Set(["/cart", "/contact", "/shop", "/terms-of-trade"]);

function shouldShowSiteOutro(pathname: string) {
  const normalisedPathname = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return (
    !routesWithoutSiteOutro.has(normalisedPathname) && !normalisedPathname.startsWith("/shop/")
  );
}

function SiteOutro() {
  return (
    // The photo panel straddles the end of the page and the start of the footer, so the two
    // creams meet behind it instead of along a separate line.
    <section
      id="site-outro"
      aria-labelledby="site-outro-title"
      className="bg-gradient-to-b from-background from-50% to-muted to-50%"
    >
      <div className="dark relative text-photo-foreground">
        {/* Like the hero, the photo runs full width on phones and tablets and is an inset panel on
           desktop. Only the photo layers are clipped to it, so the phone can hang below. */}
        <div className="absolute inset-0 overflow-hidden border-t border-border bg-photo-scrim lg:inset-x-3 lg:rounded-2xl lg:border-t-0">
          <Picture
            image="IMG_1779"
            alt=""
            className="absolute inset-0 size-full object-cover object-center"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-photo-scrim/82 via-photo-scrim/68 to-photo-scrim/35" />
          <NoiseTexture
            aria-hidden="true"
            frequency={0.35}
            octaves={3}
            slope={0.5}
            noiseOpacity={0.55}
            className="z-20 opacity-10 dark:opacity-20"
          />
        </div>

        {/* On phones the copy leaves room below for the phone. From tablets up the copy keeps to the
            left and the phone takes the right. */}
        <div className="relative z-30 site-container flex flex-col justify-center pt-14 pb-40 md:min-h-[clamp(22rem,34vw,26.25rem)] md:py-16">
          <MotionReveal className="relative z-10 max-w-4xl md:max-w-[min(34rem,44%)]">
            <p className="font-cursive text-2xl text-primary text-shadow-photo md:text-3xl">
              Anything to do with signage?
            </p>
            <h2
              id="site-outro-title"
              className="mt-3 max-w-3xl text-3xl font-black leading-tight text-shadow-photo md:text-5xl"
            >
              Give us a call, or send us the rough idea.
            </h2>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={siteSettings.phoneHref}
                aria-label={`Call ${siteSettings.phone}`}
                className={buttonVariants({ size: "lg" })}
              >
                <PhoneIcon data-icon="inline-start" />
                {siteSettings.phone}
              </a>
              <Link
                to="/contact"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "group")}
              >
                Get a Quote
                <ArrowRightIcon
                  data-icon="inline-end"
                  className="motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-within/button:translate-x-1"
                />
              </Link>
            </div>
          </MotionReveal>
        </div>

        {/* The phone tilts across the right of the panel and runs just past its top and bottom. It
            stops growing at about half the page width when the copy wraps onto more lines, and on
            wide screens it stays near the copy instead of the page edge. On phones it sits under
            the buttons and hangs off the bottom. */}
        <NeonPhone className="pointer-events-none absolute -right-[6%] -bottom-10 z-30 w-[min(62vw,18.75rem)] -rotate-9 md:top-1/2 md:right-[max(-3%,calc(50%-48rem))] md:bottom-auto md:h-[min(126%,calc(55vw/1.5))] md:w-auto md:-translate-y-1/2 md:-rotate-11" />
      </div>
    </section>
  );
}

export { shouldShowSiteOutro, SiteOutro };
