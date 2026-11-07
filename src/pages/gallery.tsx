import { Gallery } from "@/components/gallery";
import { MotionReveal } from "@/components/motion-reveal";
import { galleryImages } from "@/content";
import { MarketingHero } from "@/layout/marketing-hero";
import { PageSection } from "@/layout/page-section";

// Hero and subtitle only. No service filter here; the page stays decoupled from
// the service vocabulary.
function GalleryPage() {
  return (
    <>
      <MarketingHero image="IMG_9381" title="Gallery">
        <p>A mix of signs we have made around Melbourne.</p>
      </MarketingHero>
      <PageSection>
        <MotionReveal>
          <p className="mb-10 max-w-4xl text-lg leading-8 text-muted-foreground md:text-xl md:leading-9">
            Shopfronts, vehicles, windows, walls, neon, lightboxes and the smaller details that pull
            a job together. If something here gives you a direction, send it through with your
            enquiry.
          </p>
        </MotionReveal>
        <MotionReveal>
          <Gallery images={galleryImages()} orientation="landscape" />
        </MotionReveal>
      </PageSection>
    </>
  );
}

export { GalleryPage };
