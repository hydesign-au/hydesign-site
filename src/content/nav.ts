import { ShoppingBagIcon, type LucideIcon } from "lucide-react";

import { services } from "./services";

export type NavItem = {
  label: string;
  href: string;
  dropdown?: "services";
  external?: boolean;
  icon?: LucideIcon;
};

// Main navigation. Shop stays out entirely until Shopify storefront env exists.
// The gallery route is reached from the homepage and footer, not the menu.
const baseNavItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", dropdown: "services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] satisfies NavItem[];

const shopNavItem = {
  label: "Shop",
  href: "/shop",
  icon: ShoppingBagIcon,
} satisfies NavItem;

export function getNavItems(shopEnabled: boolean): NavItem[] {
  return shopEnabled ? [...baseNavItems, shopNavItem] : baseNavItems;
}

export const serviceNavItems = services.map((service) => ({
  label: service.navLabel,
  href: `/services/${service.slug}`,
}));
