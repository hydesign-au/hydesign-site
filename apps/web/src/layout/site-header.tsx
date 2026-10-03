import { buttonVariants } from "@hydesign/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@hydesign/ui/components/navigation-menu";
import { cn } from "@hydesign/ui/lib/utils";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { PhoneIcon } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

import { Logo } from "@/components/logo";
import { getNavItems, serviceNavItems, siteSettings } from "@/content";
import { MobileNav } from "@/layout/mobile-nav";
import { isActivePath } from "@/lib/active-path";

import styles from "./site-header.module.css";

type PathnameRouterState = {
  location: {
    pathname: string;
  };
};

function SiteHeader({ shopEnabled }: { shopEnabled: boolean }) {
  const pathname = useRouterState({
    select: (state: PathnameRouterState) => state.location.pathname,
  });
  const navItems = getNavItems(shopEnabled);
  const headerRef = useHeaderSurface();

  return (
    <header
      id="site-header"
      ref={headerRef}
      className={cn("fixed z-40 rounded-2xl", styles.header)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] border border-glass-border bg-glass shadow-glass inset-shadow-glass backdrop-blur-glass",
          styles.surface,
        )}
      />
      <div
        data-header-content
        className="relative flex h-15 items-center p-[var(--header-padding)] lg:pr-3 justify-between gap-4 text-glass-foreground lg:grid lg:grid-cols-[1fr_auto_1fr]"
      >
        <Link to="/" className="flex h-11 w-fit items-center px-2" aria-label="HyDesign home">
          <Logo className="h-7 w-auto shrink-0 translate-y-[0.45px]" />
        </Link>

        <NavigationMenu align="center" className="hidden lg:flex lg:justify-self-center">
          <NavigationMenuList className="gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavigationMenuItem key={item.href}>
                  {item.dropdown === "services" ? (
                    <>
                      <NavigationMenuTrigger
                        data-active={isActivePath(pathname, item.href) || undefined}
                        className={cn("h-9 bg-transparent px-3 font-semibold", styles.navItem)}
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="w-[min(calc(100vw-2rem),40rem)] p-0">
                        <ul className="grid gap-1 p-4 md:grid-cols-2">
                          <DesktopServiceNavItem
                            active={pathname === item.href}
                            href={item.href}
                            title="All Services"
                          />
                          {serviceNavItems.map((service) => (
                            <DesktopServiceNavItem
                              key={service.href}
                              active={isActivePath(pathname, service.href)}
                              href={service.href}
                              title={service.label}
                            />
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink
                      render={
                        item.external ? (
                          <a href={item.href} target="_blank" rel="noopener noreferrer" />
                        ) : (
                          <Link to={item.href} />
                        )
                      }
                      active={isActivePath(pathname, item.href)}
                      className={cn("h-9 justify-center px-3 py-2 font-semibold", styles.navItem)}
                    >
                      {Icon ? <Icon data-icon="inline-start" /> : null}
                      {item.label}
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 justify-self-end">
          {/* The phone is one tap away on every page: an icon on small screens, the number from lg. */}
          <a
            href={siteSettings.phoneHref}
            aria-label={`Call ${siteSettings.phone}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              styles.call,
              "size-11 px-0 lg:h-9 lg:w-auto lg:px-3",
            )}
          >
            <PhoneIcon />
            <span className="hidden lg:inline">{siteSettings.phone}</span>
          </a>
          <div className="flex items-center lg:hidden">
            <MobileNav items={navItems} pathname={pathname} />
          </div>
        </div>
      </div>
    </header>
  );
}

function useHeaderSurface() {
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const header = ref.current;
    if (!header) return undefined;
    let frame = 0;
    const update = () => header.toggleAttribute("data-scrolled", window.scrollY > 80);
    const pauseMotion = () => {
      cancelAnimationFrame(frame);
      header.removeAttribute("data-motion-ready");
    };
    const settle = () => {
      pauseMotion();
      update();
      // Paint the restored route at its final geometry before allowing scroll motion again.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => header.setAttribute("data-motion-ready", ""));
      });
    };
    settle();
    window.addEventListener("scroll", update, { passive: true });
    const unsubscribeStart = router.subscribe("onBeforeNavigate", pauseMotion);
    const unsubscribeRendered = router.subscribe("onRendered", settle);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      unsubscribeStart();
      unsubscribeRendered();
    };
  }, [router]);

  return ref;
}

function DesktopServiceNavItem({
  active,
  href,
  title,
}: {
  active: boolean;
  href: string;
  title: string;
}) {
  return (
    <li>
      <NavigationMenuLink
        render={<Link to={href} />}
        active={active}
        className="w-fit px-2 py-1 text-sm font-medium leading-6 text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-active:bg-primary/20 data-active:text-primary-ink"
      >
        {title}
      </NavigationMenuLink>
    </li>
  );
}

export { SiteHeader };
