/**
 * True when `href` is the current page or one of its children.
 * "/" only matches exactly, otherwise Home would always look active.
 * So /puppies/copper-male highlights "Puppies".
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  const path = href.split("#")[0];
  return pathname === path || pathname.startsWith(`${path}/`);
}
