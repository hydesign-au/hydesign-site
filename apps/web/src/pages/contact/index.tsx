import { MotionReveal } from "@/components/motion-reveal";
import { callHeroAction, MarketingHero } from "@/layout/marketing-hero";
import { PageSection } from "@/layout/page-section";
import type { ContactFormConfig } from "@/lib/contact";
import { ContactDetails } from "@/pages/contact/contact-details";
import { ContactFormCard } from "@/pages/contact/contact-form";

// Keep the contact path direct: hero, form and contact details. The form always
// renders so staging and previews show it; the server refuses enquiries until
// Turnstile and email are configured.
function ContactPage({
  formConfig,
  initialService,
}: {
  formConfig: ContactFormConfig;
  initialService?: string;
}) {
  return (
    <>
      <MarketingHero
        image="IMG_6169"
        title="Contact"
        actions={[{ scrollTargetId: "contact-form", label: "Send an Enquiry" }, callHeroAction]}
      >
        <p>
          Call, email or send an enquiry. We are based in Langwarrin and work across Frankston, the
          Mornington Peninsula and Melbourne.
        </p>
      </MarketingHero>
      <PageSection id="contact-form" className="scroll-mt-24">
        <MotionReveal>
          <div className="grid gap-10 lg:grid-cols-[minmax(34rem,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <ContactFormCard config={formConfig} initialService={initialService} />
            <ContactDetails />
          </div>
        </MotionReveal>
      </PageSection>
    </>
  );
}

export { ContactPage };
