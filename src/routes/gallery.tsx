import { createFileRoute, useHydrated } from "@tanstack/react-router";
import { useState } from "react";

import { Gallery } from "@/components/gallery";
import { MarketingHero } from "@/components/marketing-hero";
import { MotionReveal } from "@/components/motion-reveal";
import { PageSection } from "@/components/page-section";
import { galleryImages } from "@/content";
import { breadcrumbSchema, seo } from "@/lib/seo";

export const Route = createFileRoute("/gallery")({
  head: () =>
    seo({
      title: "Gallery",
      description:
        "Photos of signs we have painted, printed, fabricated and installed around Melbourne.",
      pathname: "/gallery",
      schema: [
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "Gallery", pathname: "/gallery" },
        ]),
      ],
    }),
  component: GalleryPage,
});

function GalleryPage() {
  const hydrated = useHydrated();
  const [images] = useState(() => {
    const shuffled = [...galleryImages()];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    return shuffled;
  });

  return (
    <>
      <MarketingHero
        image="IMG_9381"
        title="Gallery"
        subtitle="Our work for shops, venues, offices and vehicles around Melbourne. If something gets you thinking, send it through with your enquiry."
        actions={[
          { href: "/contact", label: "Get a Quote" },
          { href: "/projects", label: "Projects", kind: "secondary" },
        ]}
      />
      <PageSection>
        <MotionReveal>
          <Gallery
            images={hydrated ? images : galleryImages()}
            orientation="landscape"
            pageSize={images.length}
          />
        </MotionReveal>
      </PageSection>
    </>
  );
}
