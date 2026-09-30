import { Separator } from "@hydesign/ui/components/separator";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { type ReactNode } from "react";

import { siteSettings } from "@/content";

function ContactDetails() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-5">
        <Separator />
        <div className="grid gap-3">
          <ContactMethod
            href={siteSettings.phoneHref}
            icon={<PhoneIcon className="size-5" />}
            ariaLabel={`Call ${siteSettings.phone}`}
          >
            {siteSettings.phone}
          </ContactMethod>
          <ContactMethod
            href={siteSettings.emailHref}
            icon={<MailIcon className="size-5" />}
            ariaLabel={`Email ${siteSettings.email}`}
          >
            {siteSettings.email}
          </ContactMethod>
          <ContactMethod icon={<MapPinIcon className="size-5" />}>
            {siteSettings.address}
            <span className="mt-1 block text-sm font-medium text-muted-foreground">
              {siteSettings.visitPolicy}
            </span>
          </ContactMethod>
        </div>
        <Separator />
      </div>
      <div className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
        <p>{siteSettings.hours}</p>
        <p>ABN {siteSettings.abn}</p>
      </div>
      <div className="grid gap-2 text-base leading-7">
        <h2 className="font-bold">Getting a quote</h2>
        <p className="text-muted-foreground">
          Tell us what the sign is for, where it will go and roughly how big it needs to be. If you
          have photos of the spot or a logo file, you can email them to us.
        </p>
      </div>
    </div>
  );
}

type ContactMethodProps = {
  ariaLabel?: string;
  href?: string;
  icon: ReactNode;
  children: ReactNode;
};

function ContactMethod({ ariaLabel, children, href, icon }: ContactMethodProps) {
  const content = (
    <span className="flex items-center gap-4 text-card-foreground">
      <span className="grid size-10 shrink-0 place-items-center text-primary-ink">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block break-words text-lg font-black leading-tight group-hover:underline md:text-xl">
          {children}
        </span>
      </span>
    </span>
  );

  return href ? (
    <a
      aria-label={ariaLabel}
      className="group rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      href={href}
    >
      {content}
    </a>
  ) : (
    content
  );
}

export { ContactDetails };
