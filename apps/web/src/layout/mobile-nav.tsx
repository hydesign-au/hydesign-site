import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@hydesign/ui/components/sidebar";
import { Link } from "@tanstack/react-router";

import { serviceNavItems, type NavItem } from "@/content";
import { isActivePath } from "@/lib/active-path";

function MobileSidebarNav({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <Sidebar side="right" className="md:hidden">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <MobileSidebarLink
                    active={isActivePath(pathname, item.href)}
                    href={item.href}
                    label={item.label}
                    external={item.external}
                    icon={item.icon}
                  />
                  {item.dropdown === "services" ? (
                    <SidebarMenuSub>
                      {serviceNavItems.map((service) => (
                        <SidebarMenuSubItem key={service.href}>
                          <MobileSidebarSubLink
                            active={isActivePath(pathname, service.href)}
                            href={service.href}
                            label={service.label}
                          />
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function MobileSidebarLink({
  active,
  href,
  label,
  external,
  icon: Icon,
}: {
  active: boolean;
  href: string;
  label: string;
  external?: boolean;
  icon?: NavItem["icon"];
}) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenuButton
      render={
        external ? (
          <a
            href={href}
            onClick={() => setOpenMobile(false)}
            target="_blank"
            rel="noopener noreferrer"
          />
        ) : (
          <Link to={href} onClick={() => setOpenMobile(false)} />
        )
      }
      isActive={active}
    >
      {Icon ? <Icon data-icon="inline-start" /> : null}
      <span>{label}</span>
    </SidebarMenuButton>
  );
}

function MobileSidebarSubLink({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenuSubButton
      render={<Link to={href} onClick={() => setOpenMobile(false)} />}
      isActive={active}
    >
      <span>{label}</span>
    </SidebarMenuSubButton>
  );
}

export { MobileSidebarNav };
