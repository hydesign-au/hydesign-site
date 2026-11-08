import { type ReactNode, useEffect } from "react";

import { FloatingCart } from "@/components/shop/cart-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type PublicLayoutProps = {
  children: ReactNode;
  shopEnabled: boolean;
};

function PublicLayout({ children, shopEnabled }: PublicLayoutProps) {
  useEffect(() => {
    document.addEventListener("click", preventCurrentRouteNavigation, true);
    return () => document.removeEventListener("click", preventCurrentRouteNavigation, true);
  }, []);

  return (
    <div className="min-h-screen min-w-0 flex-1 overflow-x-clip bg-background text-foreground">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-sm"
      >
        Skip to content
      </a>
      <SiteHeader shopEnabled={shopEnabled} />
      <main id="content">{children}</main>
      <SiteFooter shopEnabled={shopEnabled} />
      {shopEnabled ? <FloatingCart /> : null}
    </div>
  );
}

function preventCurrentRouteNavigation(event: MouseEvent) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    !(event.target instanceof Element)
  ) {
    return;
  }

  const link = event.target.closest<HTMLAnchorElement>("a[href]");
  if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

  if (link.href === window.location.href) event.preventDefault();
}

export { PublicLayout };
