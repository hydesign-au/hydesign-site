import { buttonVariants } from "@hydesign/ui/components/button";
import { cn } from "@hydesign/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, MapPinIcon } from "lucide-react";

import { Gallery } from "@/components/gallery";
import { MotionReveal } from "@/components/motion-reveal";
import { PhotoBlurb } from "@/components/photo-blurb";
import { Picture } from "@/components/picture";
import {
  getProject,
  getService,
  galleryImagesByFolder,
  serviceHref,
  serviceSlugsForImages,
  type Project,
  type Service,
  videos,
} from "@/content";
import { MarketingHero } from "@/layout/marketing-hero";
import { PageHeader, PageSection } from "@/layout/page-section";

type ProjectPageTemplateProps = {
  project: Project;
};

function ProjectPageTemplate({ project }: ProjectPageTemplateProps) {
  const heroVideo = project.heroVideo ? videos[project.heroVideo] : undefined;
  // The gallery is a standalone, clickable set of the whole album, matched by the project's
  // client name; it's free to repeat a photo the hero or a section also uses.
  const galleryPhotos = galleryImagesByFolder(project.galleryFolder);
  const relatedProjects = project.relatedProjects
    .map((slug) => getProject(slug))
    .filter((related): related is Project => Boolean(related));
  // Services shown in this project, from the album's human-authored metadata.
  const projectServices = serviceSlugsForImages(galleryPhotos)
    .map((slug) => getService(slug))
    .filter((service): service is Service => Boolean(service));

  return (
    <article>
      <MarketingHero
        image={project.heroImage}
        title={project.title}
        subtitle={project.summary}
        video={heroVideo}
        actions={[{ href: "/contact", label: "Get a Quote" }]}
      >
        <p className="flex items-center gap-2 text-base md:text-lg">
          <MapPinIcon aria-hidden className="size-4 shrink-0" />
          {project.location}
        </p>
      </MarketingHero>

      <PageSection compact>
        <MotionReveal>
          <div className="grid max-w-4xl gap-5 text-lg leading-8 text-muted-foreground md:text-xl md:leading-9">
            {project.intro.map((paragraph, index) => (
              <p key={`${project.slug}-intro-${index}`}>{paragraph}</p>
            ))}
          </div>
          {projectServices.length ? (
            <nav aria-label="Services in this project" className="mt-8 flex flex-wrap gap-3">
              {projectServices.map((service) => (
                <Link
                  key={service.slug}
                  to={serviceHref(service)}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "group",
                    }),
                  )}
                >
                  {service.title}
                  <ArrowRightIcon data-icon="inline-end" className="motion-arrow" />
                </Link>
              ))}
            </nav>
          ) : null}
        </MotionReveal>
      </PageSection>

      {project.sections.map((section, index) => (
        <PageSection key={`${project.slug}-section-${index}`} compact>
          <MotionReveal>
            <div
              className={cn(
                "grid gap-8 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-center",
                index % 2 === 1 && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div className="max-w-3xl">
                <h2 className="text-3xl font-black leading-tight md:text-5xl">{section.title}</h2>
                <div className="mt-5 grid gap-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                  <p>{section.body}</p>
                </div>
              </div>
              {section.image ? (
                <Picture
                  image={section.image}
                  className="w-full rounded-lg shadow-surface ring-1 ring-glass-border inset-shadow-glass"
                />
              ) : null}
            </div>
          </MotionReveal>
        </PageSection>
      ))}

      {galleryPhotos.length ? (
        <PageSection>
          <MotionReveal>
            <PageHeader title="Photos" />
          </MotionReveal>
          <MotionReveal>
            <Gallery
              images={galleryPhotos}
              orientation={project.galleryOrientation}
              className="mt-8"
            />
          </MotionReveal>
        </PageSection>
      ) : null}

      {relatedProjects.length ? (
        <PageSection compact>
          <MotionReveal>
            <PageHeader title="More projects" />
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {relatedProjects.map((related) => (
                <PhotoBlurb
                  key={related.slug}
                  href={`/projects/${related.slug}`}
                  image={related.heroImage}
                  title={related.title}
                  subtitle={related.summary}
                />
              ))}
            </div>
          </MotionReveal>
        </PageSection>
      ) : null}
    </article>
  );
}

export { ProjectPageTemplate };
