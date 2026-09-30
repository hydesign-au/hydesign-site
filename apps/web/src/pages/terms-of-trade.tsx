import { Separator } from "@hydesign/ui/components/separator";
import { cn } from "@hydesign/ui/lib/utils";
import { Fragment } from "react";

import { MotionReveal } from "@/components/motion-reveal";
import { termsOfTrade, type TermsBlock } from "@/content/legal/terms-of-trade";
import { PageHeader, PageSection } from "@/layout/page-section";

function TermsOfTradePage() {
  return (
    <PageSection compact className="pt-24 md:pt-28">
      <div className="mx-auto max-w-5xl">
        <PageHeader level={1} title="Terms of Trade">
          {termsOfTrade.title}
        </PageHeader>

        <div className="mt-10">
          {termsOfTrade.sections.map((section, sectionIndex) => (
            <Fragment key={section.heading}>
              {sectionIndex > 0 ? <Separator /> : null}
              <MotionReveal>
                <section className={cn("py-8", sectionIndex === 0 && "pt-0")}>
                  <h2 className="text-2xl font-black leading-tight md:text-3xl">
                    {section.heading}
                  </h2>
                  <div className="mt-5 grid gap-3">
                    {section.blocks.map((block, index) => (
                      <TermsBlockView key={`${section.heading}-${index}`} block={block} />
                    ))}
                  </div>
                </section>
              </MotionReveal>
            </Fragment>
          ))}
        </div>
      </div>
    </PageSection>
  );
}

function TermsBlockView({ block }: { block: TermsBlock }) {
  if (block.kind === "note") {
    return <p className="pt-4 text-sm italic leading-7 text-muted-foreground">{block.text}</p>;
  }

  if (block.kind === "paragraph") {
    return (
      <p
        className={cn(
          "text-sm leading-7 text-muted-foreground md:text-base",
          block.level === 1 && "ml-6",
          block.level === 2 && "ml-12",
        )}
      >
        {block.text}
      </p>
    );
  }

  return (
    <p
      className={cn(
        "grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3 text-sm leading-7 md:grid-cols-[4.25rem_minmax(0,1fr)] md:text-base",
        block.level === 1 &&
          "ml-6 grid-cols-[2.5rem_minmax(0,1fr)] md:grid-cols-[3rem_minmax(0,1fr)]",
        block.level === 2 &&
          "ml-12 grid-cols-[2.75rem_minmax(0,1fr)] md:grid-cols-[3.25rem_minmax(0,1fr)]",
      )}
    >
      <span className="font-semibold tabular-nums text-foreground">{block.marker}</span>
      <span className="min-w-0 text-muted-foreground">{block.text}</span>
    </p>
  );
}

export { TermsOfTradePage };
