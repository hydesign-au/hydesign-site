import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowRightIcon, CameraIcon } from "lucide-react";

import { ExpressiveHeading } from "@/components/expressive-heading";
import { Gallery } from "@/components/gallery";
import { callHeroAction, MarketingHero } from "@/components/marketing-hero";
import { MotionReveal } from "@/components/motion-reveal";
import { PageHeader, PageSection } from "@/components/page-section";
import { PhotoFan } from "@/components/photo-fan";
import { PhotoMosaic } from "@/components/photo-mosaic";
import { buttonVariants } from "@/components/ui/button";
import {
  getService,
  clientPhotos,
  projects,
  servicePhotos,
  serviceSlugsForImages,
  type Service,
  videos,
} from "@/content";
import { breadcrumbSchema, seo, serviceSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

type SlugRouteHeadArgs = {
  params: {
    slug: string;
  };
};

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ params }: SlugRouteHeadArgs) => {
    const service = getService(params.slug);
    if (!service) return {};

    return seo({
      title: service.seoTitle,
      description: service.metaDescription,
      pathname: `/services/${service.slug}`,
      schema: [
        serviceSchema(service),
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "Services", pathname: "/services" },
          { name: service.title, pathname: `/services/${service.slug}` },
        ]),
      ],
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { service } = Route.useLoaderData();
  return <ServicePageTemplate service={service} />;
}

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
  const galleryPhotos = servicePhotos(service.slug).filter((key) => !shownPhotos.has(key));
  const heroVideo = service.heroVideo ? videos[service.heroVideo] : undefined;
  // Projects whose photos include this service.
  const relatedProjects = projects.filter((project) =>
    serviceSlugsForImages(clientPhotos(project.client)).includes(service.slug),
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
            <PageHeader title="Gallery" icon={CameraIcon} />
          </MotionReveal>
          <MotionReveal>
            <Gallery
              key={service.slug}
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
