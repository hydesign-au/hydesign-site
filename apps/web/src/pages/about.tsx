import { MotionReveal } from "@/components/motion-reveal";
import { Picture } from "@/components/picture";
import { MarketingHero } from "@/layout/marketing-hero";
import { PageSection } from "@/layout/page-section";

function AboutPage() {
  return (
    <article>
      <MarketingHero
        image="IMG_6847"
        title="About"
        actions={[
          { href: "/contact", label: "Get a Quote" },
          { href: "/projects", label: "Projects", kind: "secondary" },
        ]}
      >
        <p>A boutique family business in Langwarrin. Signs since 1980.</p>
      </MarketingHero>

      <PageSection>
        <MotionReveal>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:items-center">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-black leading-tight md:text-5xl">How it started</h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                Walking home from school, Trevor remembers stopping by his local milk bar. A
                signwriter was painting on the window, and he stopped to watch the letters come
                together from a few brush strokes.
              </p>
              <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                He trained at the Melbourne College of Decoration at 17 and started the business in
                1980.
              </p>
            </div>
            <Picture
              image="IMG_6780"
              alt="An old photo of a signwriter working above a row of shopfronts."
              className="w-full rounded-panel shadow-surface ring-1 ring-glass-border inset-shadow-glass"
            />
          </div>
        </MotionReveal>
      </PageSection>

      <PageSection tone="muted" compact>
        <MotionReveal>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-center">
            <Picture
              image="IMG_5567"
              className="w-full rounded-panel shadow-surface ring-1 ring-glass-border inset-shadow-glass"
            />
            <div className="max-w-3xl">
              <h2 className="text-3xl font-black leading-tight md:text-5xl">What changed</h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                We have been making signs around Melbourne for more than 45 years. It started with
                painted shopfronts, tradie vehicles, menus and banners.
              </p>
              <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                Then came vinyl cutters, digital printers and lightboxes. We still paint signs. We
                just have more ways to make them now.
              </p>
            </div>
          </div>
        </MotionReveal>
      </PageSection>
    </article>
  );
}

export { AboutPage };
