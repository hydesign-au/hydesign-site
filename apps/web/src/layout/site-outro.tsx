import { buttonVariants } from "@hydesign/ui/components/button";
import { Neon } from "@hydesign/ui/components/neon";
import { NoiseTexture } from "@hydesign/ui/components/noise-texture";
import { cn } from "@hydesign/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, PhoneIcon } from "lucide-react";
import type { CSSProperties } from "react";

import { MotionReveal } from "@/components/motion-reveal";
import { Picture } from "@/components/picture";
import { VintagePhone } from "@/components/vintage-phone";
import { siteSettings } from "@/content";

const routesWithoutSiteOutro = new Set(["/cart", "/contact", "/shop", "/terms-of-trade"]);

const phoneNeonStyle: CSSProperties & {
  "--neon-medium-blur": string;
  "--neon-wide-blur": string;
  "--neon-ambient-blur": string;
  "--neon-ambient-inset": string;
  "--neon-ambient-opacity": string;
  "--neon-brightness": string;
} = {
  "--neon-medium-blur": "12px",
  "--neon-wide-blur": "36px",
  "--neon-ambient-blur": "64px",
  "--neon-ambient-inset": "-4.5rem",
  "--neon-ambient-opacity": "0.56",
  "--neon-brightness": "1.6",
};

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
      className="bg-gradient-to-b from-canvas from-50% to-footer-surface to-50%"
    >
      <div className="dark relative text-photo-foreground">
        {/* Like the hero, the photo runs full width on phones and tablets and is an inset panel on
           desktop. Only the photo layers are clipped to it, so the phone can hang below. */}
        <div className="absolute inset-0 overflow-hidden border-t border-border bg-photo-surface lg:inset-x-3 lg:rounded-panel lg:border-t-0">
          <Picture
            image="IMG_1779"
            alt=""
            className="absolute inset-0 size-full object-cover object-center"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-photo-surface/82 via-photo-surface/68 to-photo-surface/35" />
          <NoiseTexture
            aria-hidden="true"
            frequency={0.35}
            octaves={3}
            slope={0.5}
            noiseOpacity={0.55}
            className="z-20 opacity-10 dark:opacity-20"
          />
        </div>

        <div className="relative z-30 mx-auto grid min-h-[22rem] max-w-7xl items-center gap-8 px-5 py-14 md:grid-cols-[minmax(0,1fr)_18rem] md:px-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:py-16 xl:grid-cols-[minmax(0,1fr)_28rem]">
          <MotionReveal className="relative z-10 max-w-4xl">
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
                <ArrowRightIcon data-icon="inline-end" className="motion-arrow" />
              </Link>
            </div>
          </MotionReveal>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -bottom-10 w-56 sm:-right-2 sm:w-64 md:relative md:right-auto md:bottom-auto md:w-auto md:self-end"
          >
            <Neon
              color="var(--neon-pink)"
              intensity="strong"
              spread="wide"
              once={false}
              amount={0.6}
              delay={140}
              style={phoneNeonStyle}
              className="block rotate-[9deg] md:-mb-24 lg:-mb-28"
            >
              <VintagePhone className="h-auto w-full" />
            </Neon>
          </div>
        </div>
      </div>
    </section>
  );
}

export { shouldShowSiteOutro, SiteOutro };
