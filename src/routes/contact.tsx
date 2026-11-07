import { createFileRoute } from "@tanstack/react-router";

import { ContactDetails } from "@/components/contact-details";
import { ContactFormCard } from "@/components/contact-form";
import { callHeroAction, MarketingHero } from "@/components/marketing-hero";
import { MotionReveal } from "@/components/motion-reveal";
import { PageSection } from "@/components/page-section";
import { type ContactFormConfig } from "@/lib/contact";
import { getContactFormConfig } from "@/lib/contact.functions";
import { breadcrumbSchema, seo } from "@/lib/seo";

type ContactSearch = {
  service?: string;
};

export const Route = createFileRoute("/contact")({
  loader: () => getContactFormConfig(),
  validateSearch: (search: Record<string, unknown>): ContactSearch => {
    return typeof search.service === "string" && search.service ? { service: search.service } : {};
  },
  head: () =>
    seo({
      title: "Contact",
      description:
        "Call 0410 544 641 or send an enquiry. Family signwriting and printing business in Langwarrin, working across Frankston, the Mornington Peninsula and Melbourne.",
      pathname: "/contact",
      schema: [
        breadcrumbSchema([
          { name: "Home", pathname: "/" },
          { name: "Contact", pathname: "/contact" },
        ]),
      ],
    }),
  component: RouteComponent,
});

function RouteComponent() {
  const { service } = Route.useSearch();
  return <ContactPage formConfig={Route.useLoaderData()} initialService={service} />;
}

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
