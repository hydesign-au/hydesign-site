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
import { Link, useRouterState } from "@tanstack/react-router";
import { PhoneIcon } from "lucide-react";

import { Logo } from "@/components/logo";
import { getNavItems, serviceNavItems, siteSettings } from "@/content";
import { MobileSidebarNav } from "@/layout/mobile-nav";
import { MobileNavTrigger } from "@/layout/mobile-nav-trigger";
import { isActivePath } from "@/lib/active-path";

type PathnameRouterState = {
  location: {
    pathname: string;
  };
};

const standardNavClassName =
  "text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent data-[active]:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground";

function SiteHeader({ shopEnabled }: { shopEnabled: boolean }) {
  const pathname = useRouterState({
    select: (state: PathnameRouterState) => state.location.pathname,
  });
  const navItems = getNavItems(shopEnabled);
  return (
    <header className="fixed inset-x-3 top-3 z-40 mx-auto max-w-[90rem] rounded-xl border border-glass-border bg-glass text-glass-foreground shadow-glass inset-shadow-glass backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-15 items-center justify-between gap-4 px-5 min-[42rem]:grid min-[42rem]:grid-cols-[1fr_auto_1fr]">
        <Link to="/" className="flex items-center" aria-label="HyDesign home">
          <Logo className="h-7 w-auto shrink-0 translate-y-[0.45px]" />
        </Link>

        <NavigationMenu
          align="center"
          className="hidden min-[42rem]:flex min-[42rem]:justify-self-center"
        >
          <NavigationMenuList>
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavigationMenuItem key={item.href}>
                  {item.dropdown === "services" ? (
                    <>
                      <NavigationMenuTrigger
                        data-active={isActivePath(pathname, item.href) || undefined}
                        className={cn("bg-transparent font-semibold", standardNavClassName)}
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="w-[min(calc(100vw-2rem),40rem)] overflow-hidden rounded-lg bg-popover p-0 text-popover-foreground">
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
                      className={cn("px-3 py-2 font-semibold", standardNavClassName)}
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
              "size-9 px-0 lg:w-auto lg:px-2.5",
            )}
          >
            <PhoneIcon />
            <span className="hidden lg:inline">{siteSettings.phone}</span>
          </a>
          <div className="flex items-center min-[42rem]:hidden">
            <MobileNavTrigger />
            <MobileSidebarNav items={navItems} pathname={pathname} />
          </div>
        </div>
      </div>
    </header>
  );
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
        className="w-fit px-2 py-1 text-sm font-medium leading-6 text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-active:bg-accent data-active:text-accent-foreground"
      >
        {title}
      </NavigationMenuLink>
    </li>
  );
}

export { SiteHeader };
