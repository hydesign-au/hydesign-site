import { MotionReveal } from "@/components/motion-reveal";
import { PhotoBlurb } from "@/components/photo-blurb";
import { serviceHref, services } from "@/content";
import { MarketingHero } from "@/layout/marketing-hero";
import { PageSection } from "@/layout/page-section";

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

export { ServicesIndexPage };
