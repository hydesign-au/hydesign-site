import { buttonVariants } from "@hydesign/ui/components/button";
import { cn } from "@hydesign/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

import { ExpressiveHeading } from "@/components/expressive-heading";
import { Gallery } from "@/components/gallery";
import { MotionReveal } from "@/components/motion-reveal";
import { PhotoFan } from "@/components/photo-fan";
import { PhotoMosaic } from "@/components/photo-mosaic";
import {
  galleryImagesByFolder,
  projects,
  serviceSlugsForImages,
  type Service,
  videos,
} from "@/content";
import { callHeroAction, MarketingHero } from "@/layout/marketing-hero";
import { PageHeader, PageSection } from "@/layout/page-section";

// Service pages stay short: a clear title, one useful paragraph, the service's
// photos and the shared contact path. The words and photos vary; the shell does
// not manufacture extra content to fill space.
function ServicePageTemplate({ service }: { service: Service }) {
  const sections = service.sections ?? [];
  // Every photo filed under the service belongs on its page. The hero and the
  // section photos are already shown, so the grid carries the rest.
  const shownPhotos = new Set([
    service.heroImage,
    ...sections.flatMap((section) => section.photos),
  ]);
  const galleryPhotos = galleryImagesByFolder(service.galleryFolder, {
    includeChildren: service.includeChildGalleryFolders,
  }).filter((key) => !shownPhotos.has(key));
  const heroVideo = service.heroVideo ? videos[service.heroVideo] : undefined;
  // Projects whose albums include this service, from the library's metadata.
  const relatedProjects = projects.filter((project) =>
    serviceSlugsForImages(galleryImagesByFolder(project.galleryFolder)).includes(service.slug),
  );

  return (
    <article>
      <MarketingHero
        image={service.heroImage}
        title={<ExpressiveHeading title={service.title} treatment={service.titleTreatment} />}
        subtitle={service.heroSubtitle}
        video={heroVideo}
        actions={[
          { href: `/contact?service=${service.slug}`, label: "Get a Quote" },
          callHeroAction,
        ]}
      />

      <PageSection>
        <MotionReveal>
          <p className="max-w-4xl text-lg leading-8 text-muted-foreground md:text-xl md:leading-9">
            {service.intro}
          </p>
          {relatedProjects.length ? (
            <nav aria-label="Projects" className="mt-8 flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground">Projects</span>
              {relatedProjects.map((project) => (
                <Link
                  key={project.slug}
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "group",
                    }),
                  )}
                >
                  {project.title}
                  <ArrowRightIcon
                    data-icon="inline-end"
                    className="motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-within/button:translate-x-1"
                  />
                </Link>
              ))}
            </nav>
          ) : null}
        </MotionReveal>
      </PageSection>

      {sections.map((section, index) => (
        <PageSection key={section.title}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
            <MotionReveal className={index % 2 === 0 ? "lg:order-2" : undefined}>
              <div className="max-w-2xl">
                <h2 className="text-4xl font-black leading-[1.05] md:text-5xl xl:text-6xl">
                  {section.title}
                </h2>
                <p className="mt-6 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                  {section.description}
                </p>
              </div>
            </MotionReveal>
            <div className={index % 2 === 0 ? "lg:order-1" : undefined}>
              {index % 2 === 0 ? (
                <PhotoFan photos={section.photos} />
              ) : (
                <PhotoMosaic photos={section.photos} />
              )}
            </div>
          </div>
        </PageSection>
      ))}

      {galleryPhotos.length ? (
        <PageSection>
          <MotionReveal>
            <PageHeader title={sections.length ? "More photos" : "Photos"} />
          </MotionReveal>
          <MotionReveal>
            <Gallery
              images={galleryPhotos}
              orientation={service.galleryOrientation}
              className="mt-8"
            />
          </MotionReveal>
        </PageSection>
      ) : null}
    </article>
  );
}

export { ServicePageTemplate };
