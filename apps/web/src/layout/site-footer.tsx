import { buttonVariants } from "@hydesign/ui/components/button";
import { Separator } from "@hydesign/ui/components/separator";
import { cn } from "@hydesign/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { siFacebook, siInstagram } from "simple-icons";

import { Logo } from "@/components/logo";
import { serviceNavItems, siteSettings } from "@/content";
import { SiteSubfooter } from "@/layout/site-subfooter";

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
    <footer id="site-footer" className="bg-footer-surface text-foreground">
      {separated ? <Separator /> : null}
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[0.95fr_0.5fr_1.5fr_1.05fr] md:gap-5 md:px-8 md:py-14 lg:grid-cols-[1.1fr_0.55fr_1.35fr_1fr] lg:gap-10">
        <div>
          <Logo className="h-7 w-auto" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            A boutique family owned and operated business, doing anything to do with signs for more
            than 45 years.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              aria-label="Facebook"
              className={buttonVariants({
                variant: "plain",
                size: "icon",
                className: "bg-facebook text-white hover:opacity-80",
              })}
              href={siteSettings.facebookUrl}
            >
              <SimpleIconSvg icon={siFacebook} />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              aria-label="Instagram"
              className={buttonVariants({
                variant: "plain",
                size: "icon",
                className:
                  "bg-[radial-gradient(circle_farthest-corner_at_28%_100%,var(--instagram-yellow)_0%,var(--instagram-yellow-to)_10%,var(--instagram-orange)_22%,var(--instagram-red)_35%,transparent_65%),linear-gradient(145deg,var(--instagram-blue)_10%,var(--instagram-purple)_70%)] text-white hover:opacity-80",
              })}
              href={siteSettings.instagramUrl}
            >
              <SimpleIconSvg icon={siInstagram} />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>

        <FooterLinks title="Pages" links={pageLinks}>
          {shopEnabled ? (
            <Link className="hover:text-primary-ink" to="/shop">
              Shop
            </Link>
          ) : null}
        </FooterLinks>

        <FooterLinks title="Services" links={serviceNavItems} splitOnDesktop />

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
  children?: React.ReactNode;
  links: { href: string; label: string }[];
  splitOnDesktop?: boolean;
  title: string;
};

function FooterLinks({ children, links, splitOnDesktop = false, title }: FooterLinksProps) {
  return (
    <div>
      <h2 className="text-sm font-bold">{title}</h2>
      <div
        className={cn(
          "mt-4 grid gap-2 text-sm text-muted-foreground",
          splitOnDesktop && "md:block md:columns-2 md:gap-x-2 lg:gap-x-4",
        )}
      >
        {links.map((item) => (
          <Link
            key={item.href}
            className={cn(
              "hover:text-primary-ink",
              splitOnDesktop && "md:mb-1.5 md:block md:break-inside-avoid md:last:mb-0 lg:mb-2",
            )}
            to={item.href}
          >
            {item.label}
          </Link>
        ))}
        {children}
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
