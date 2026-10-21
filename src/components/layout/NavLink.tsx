// Header navigation link; the active page gets toffee text and a paw underneath.

import Link from "next/link";
import { PawIcon } from "@/components/decor/icons";

type NavLinkProps = {
  href: string;
  label: string;
  active: boolean;
};

export function NavLink({ href, label, active }: NavLinkProps) {
  return (
    <Link href={href} className="nav-link" data-active={active} aria-current={active ? "page" : undefined}>
      <span>{label}</span>
      <PawIcon className="nav-link__paw" />
    </Link>
  );
}
