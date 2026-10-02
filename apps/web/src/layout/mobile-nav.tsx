import { Button } from "@hydesign/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@hydesign/ui/components/collapsible";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@hydesign/ui/components/sheet";
import { cn } from "@hydesign/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { serviceNavItems, type NavItem } from "@/content";
import { isActivePath } from "@/lib/active-path";

function MobileNav({ items, pathname }: { items: NavItem[]; pathname: string }) {
  const [open, setOpen] = useState(false);

  // A menu opened on tablet must release its focus trap when desktop navigation takes over.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const linkClass = (href: string) =>
    cn(
      "flex min-h-11 items-center rounded-lg px-3 text-base font-semibold hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring",
      isActivePath(pathname, href) && "bg-primary/20 text-primary-ink hover:bg-primary/20",
    );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="icon" className="size-11" aria-label="Open navigation" />
        }
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent
        showCloseButton={false}
        className="w-[min(24rem,calc(100%-1rem))]! gap-0 pb-[env(safe-area-inset-bottom)] motion-reduce:transition-none"
      >
        <SheetHeader className="flex-row items-center justify-between border-b p-4">
          <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
          <SheetClose
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-11"
                aria-label="Close navigation"
              />
            }
          >
            <XIcon />
          </SheetClose>
        </SheetHeader>
        <nav aria-label="Main navigation" className="min-h-0 overflow-y-auto p-4">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.href}>
                {item.dropdown === "services" ? (
                  <Collapsible key={pathname} defaultOpen={isActivePath(pathname, item.href)}>
                    <CollapsibleTrigger
                      className={cn(linkClass(item.href), "group w-full justify-between")}
                    >
                      Services{" "}
                      <ChevronDownIcon className="size-4 group-data-panel-open:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="my-2 ml-3 border-l pl-2">
                        {[{ href: item.href, label: "All Services" }, ...serviceNavItems].map(
                          (service) => (
                            <li key={service.href}>
                              <Link
                                to={service.href}
                                onClick={() => setOpen(false)}
                                aria-current={pathname === service.href ? "page" : undefined}
                                className={cn(linkClass(service.href), "text-sm font-normal")}
                              >
                                {service.label}
                              </Link>
                            </li>
                          ),
                        )}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                ) : item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={linkClass(item.href)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                    className={linkClass(item.href)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export { MobileNav };
