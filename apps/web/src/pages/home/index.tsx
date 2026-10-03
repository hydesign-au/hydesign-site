import { buttonVariants } from "@hydesign/ui/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@hydesign/ui/components/carousel";
import { cn } from "@hydesign/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import createAutoplay from "embla-carousel-autoplay";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { MotionReveal } from "@/components/motion-reveal";
import { PhotoBlurb } from "@/components/photo-blurb";
import { PhotoFan } from "@/components/photo-fan";
import { Picture } from "@/components/picture";
import { ProjectsGrid } from "@/components/projects-grid";
import {
  homepageServices,
  imageAlt,
  projects,
  serviceHref,
  type ImageKey,
  type PhotoGroup,
} from "@/content";
import { callHeroAction, PhotoHeroFrame } from "@/layout/marketing-hero";
import { PageHeader, PageSection } from "@/layout/page-section";
import type { InstagramFeedResponse } from "@/lib/instagram";
import { InstagramFeedSection } from "@/pages/home/instagram-feed";
import { ReviewsSection } from "@/pages/home/reviews";

const homeGalleryPhotos: PhotoGroup = ["IMG_9613", "IMG_0245", "IMG_8254"];
const heroSlides: ImageKey[] = ["IMG_2594", "IMG_7565", "IMG_9374", "IMG_4051", "IMG_0947"];

function HomePage({ instagramFeed }: { instagramFeed: InstagramFeedResponse }) {
  return (
    <>
      <PhotoHeroFrame
        variant="home"
        fullScreen
        media={<HomeHeroMedia />}
        title={
          <>
            Printing <br />& Signwriting
          </>
        }
        actions={[{ href: "/contact", label: "Get a Quote" }, callHeroAction]}
        scrollLabel="See our services"
        scrollTargetId="services"
      >
        <p>
          A family business in Langwarrin, making signs for businesses across Frankston, the
          Mornington Peninsula and Melbourne.
        </p>
      </PhotoHeroFrame>

      <PageSection id="services" className="scroll-mt-24">
        <MotionReveal>
          <PageHeader
            title="Services"
            action={
              <Link
                to="/services"
                className={cn(buttonVariants({ variant: "outline", className: "group" }))}
              >
                Our Services
                <ArrowRightIcon
                  data-icon="inline-end"
                  className="motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-within/button:translate-x-1"
                />
              </Link>
            }
          >
            Signs and printing for shops, offices, venues, schools and work vehicles.
          </PageHeader>
        </MotionReveal>
        <MotionReveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {homepageServices.map((service) => (
              <PhotoBlurb
                key={service.slug}
                href={serviceHref(service)}
                image={service.heroImage}
                title={service.title}
                subtitle={service.heroSubtitle}
                compact
              />
            ))}
          </div>
        </MotionReveal>
      </PageSection>

      <PageSection tone="muted">
        <MotionReveal>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:items-center">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-black leading-tight md:text-5xl">
                Signwriters since 1980
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                Trevor trained as a signwriter at the Melbourne College of Decoration and started
                the business in 1980, painting shopfronts, tradie vehicles, menus and banners. The
                business is still family owned, and we still paint signs by hand alongside printing,
                cut vinyl, lightboxes and installation.
              </p>
              <Link
                to="/about"
                className={cn(buttonVariants({ variant: "outline", className: "group mt-7" }))}
              >
                About Us
                <ArrowRightIcon
                  data-icon="inline-end"
                  className="motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-within/button:translate-x-1"
                />
              </Link>
            </div>
            <Picture
              image="IMG_6780"
              alt="An old photo of a signwriter working above a row of shopfronts."
              className="w-full rounded-2xl shadow-md ring-1 ring-border"
            />
          </div>
        </MotionReveal>
      </PageSection>

      <ReviewsSection />

      <PageSection tone="muted">
        <MotionReveal>
          <PageHeader
            title="Projects"
            action={
              <Link
                to="/projects"
                className={cn(buttonVariants({ variant: "outline", className: "group" }))}
              >
                Projects
                <ArrowRightIcon
                  data-icon="inline-end"
                  className="motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-within/button:translate-x-1"
                />
              </Link>
            }
          />
        </MotionReveal>
        <MotionReveal>
          <div className="mt-8">
            <ProjectsGrid projects={projects} />
          </div>
        </MotionReveal>
      </PageSection>

      <PageSection>
        <MotionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black leading-tight md:text-5xl">Our Gallery</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              Signs we have made for shops, venues, offices and vehicles around Melbourne. If
              something gets you thinking, send it through with your enquiry.
            </p>
          </div>
        </MotionReveal>
        <MotionReveal className="mt-8">
          <PhotoFan photos={homeGalleryPhotos} />
          <div className="mt-8 flex w-full justify-center">
            <Link
              to="/gallery"
              className={cn(buttonVariants({ variant: "outline", className: "group" }))}
            >
              Explore
              <ArrowRightIcon
                data-icon="inline-end"
                className="motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-within/button:translate-x-1"
              />
            </Link>
          </div>
        </MotionReveal>
      </PageSection>

      <InstagramFeedSection feed={instagramFeed} />
    </>
  );
}

function HomeHeroMedia() {
  const [api, setApi] = useState<CarouselApi>();
  const [autoplay] = useState(() =>
    createAutoplay({
      delay: 6500,
      playOnInit: false,
    }),
  );

  useEffect(() => {
    if (!api) return undefined;

    const autoplayApi = api.plugins().autoplay;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      autoplayApi?.stop();
      return undefined;
    }

    autoplayApi?.play();
    return () => {
      autoplayApi?.stop();
    };
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[autoplay]}
      aria-label="Featured signage photos"
      className="h-full [&_[data-slot=carousel-content]]:h-full"
    >
      <CarouselContent className="-ml-0 h-full">
        {heroSlides.map((slide, index) => (
          <CarouselItem key={slide} className="h-full pl-0">
            <Picture
              image={slide}
              alt={imageAlt(slide)}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes="100vw"
              className="size-full object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export { HomePage };
