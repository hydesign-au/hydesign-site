// Active-nav matching shared by the desktop and mobile nav. The home link only
// matches "/" exactly; every other link also matches its child routes so a
// service detail page lights up the "Services" item.
function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export { isActivePath };
