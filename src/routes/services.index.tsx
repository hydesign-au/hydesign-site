import { createFileRoute } from "@tanstack/react-router";

import { MarketingHero } from "@/components/marketing-hero";
import { MotionReveal } from "@/components/motion-reveal";
import { PageSection } from "@/components/page-section";
import { PhotoBlurb } from "@/components/photo-blurb";
import { serviceHref, services } from "@/content";
import { breadcrumbSchema, seo } from "@/lib/seo";

export const Route = createFileRoute("/services/")({
  head: () =>
    seo({
      title: "Signage Services Frankston & Melbourne",
      description:
        "Signwriting, signage and printing for shopfronts, vehicles, windows, walls and events. Family owned in Langwarrin, working across Frankston and Melbourne.",
      pathname: "/services",
      schema: [
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "Services", pathname: "/services" },
        ]),
      ],
    }),
  component: ServicesIndexPage,
});

function ServicesIndexPage() {
  return (
    <>
      <MarketingHero
        image="IMG_6593"
        title="Services"
        actions={[
          { href: "/contact", label: "Get a Quote" },
          { href: "/projects", label: "Projects", kind: "secondary" },
        ]}
      >
        <p>Signs, signwriting and printing, from one sticker to a full shopfront.</p>
      </MarketingHero>

      <PageSection>
        <MotionReveal>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl md:leading-9">
            We paint, print, cut and install signs for shops, offices, venues, schools and work
            vehicles around Frankston, the Mornington Peninsula and Melbourne.
          </p>
        </MotionReveal>
        <MotionReveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <PhotoBlurb
                key={service.slug}
                href={serviceHref(service)}
                image={service.heroImage}
                title={service.title}
                subtitle={service.heroSubtitle}
                headingLevel="h2"
              />
            ))}
          </div>
        </MotionReveal>
      </PageSection>
    </>
  );
}
