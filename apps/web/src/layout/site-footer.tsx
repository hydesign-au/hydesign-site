import { Separator } from "@hydesign/ui/components/separator";
import { cn } from "@hydesign/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { siFacebook, siInstagram } from "simple-icons";

import { Logo } from "@/components/logo";
import { serviceNavItems, siteSettings } from "@/content";
import { SiteSubfooter } from "@/layout/site-subfooter";

import styles from "./site-footer.module.css";

type SimpleIcon = {
  path: string;
  title: string;
};

const pageLinks = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

type SiteFooterProps = {
  separated?: boolean;
  shopEnabled: boolean;
};

function SiteFooter({ separated = false, shopEnabled }: SiteFooterProps) {
  return (
    <footer id="site-footer" className="bg-muted text-foreground">
      {separated ? <Separator /> : null}
      <div className="site-container grid gap-10 py-12 md:grid-cols-[0.95fr_0.5fr_1.5fr_1.05fr] md:gap-5 md:py-14 lg:grid-cols-[1.1fr_0.55fr_1.35fr_1fr] lg:gap-10">
        <div>
          <Logo className="h-7 w-auto" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            A boutique family owned and operated business, doing anything to do with signs for more
            than 45 years.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              aria-label="Facebook"
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-lg text-white hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                styles.facebook,
              )}
              href={siteSettings.facebookUrl}
            >
              <SimpleIconSvg icon={siFacebook} />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              aria-label="Instagram"
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-lg text-white hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                styles.instagram,
              )}
              href={siteSettings.instagramUrl}
            >
              <SimpleIconSvg icon={siInstagram} />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>

        <FooterLinks
          title="Pages"
          links={shopEnabled ? [...pageLinks, { href: "/shop", label: "Shop" }] : pageLinks}
          singleColumnOnDesktop
        />

        <FooterLinks title="Services" links={serviceNavItems} />

        <div>
          <h2 className="text-sm font-bold">Get in touch</h2>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <a className="flex gap-2 hover:text-primary-ink" href={siteSettings.phoneHref}>
              <PhoneIcon className="mt-0.5 size-4 shrink-0 text-primary-ink" />
              {siteSettings.phone}
            </a>
            <a className="flex gap-2 hover:text-primary-ink" href={siteSettings.emailHref}>
              <MailIcon className="mt-0.5 size-4 shrink-0 text-primary-ink" />
              {siteSettings.email}
            </a>
            <p className="flex gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary-ink" />
              <span>
                <span className="block">{siteSettings.address}</span>
                <span className="block">{siteSettings.visitPolicy}</span>
              </span>
            </p>
            <p>We work across {siteSettings.serviceArea}.</p>
          </div>
        </div>
      </div>
      <SiteSubfooter reserveCartCorner={shopEnabled} />
    </footer>
  );
}

type FooterLinksProps = {
  links: { href: string; label: string }[];
  singleColumnOnDesktop?: boolean;
  title: string;
};

function FooterLinks({ links, singleColumnOnDesktop = false, title }: FooterLinksProps) {
  const midpoint = Math.ceil(links.length / 2);
  const columns = [links.slice(0, midpoint), links.slice(midpoint)];

  return (
    <div>
      <h2 className="text-sm font-bold">{title}</h2>
      <div
        className={cn(
          "mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground",
          singleColumnOnDesktop && "md:grid-cols-1",
        )}
      >
        {columns.map((column, index) => (
          <div key={index} className="grid content-start gap-2">
            {column.map((item) => (
              <Link key={item.href} className="hover:text-primary-ink" to={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleIconSvg({ icon }: { icon: SimpleIcon }) {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d={icon.path} />
    </svg>
  );
}

export { SiteFooter };
