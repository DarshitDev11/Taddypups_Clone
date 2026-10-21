"use client";

// Fixed site header: logo, desktop nav, WhatsApp button and the mobile Menu button.
// Transparent at the top of the home page; milk with a scalloped hem everywhere else.

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NavLink } from "@/components/layout/NavLink";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/siteConfig";
import { useHeaderScrollState } from "@/hooks/useHeaderScrollState";
import { isActivePath } from "@/lib/navigation";
import { generalWhatsAppLink } from "@/lib/whatsapp";

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const revealHeader = useHeaderScrollState(headerRef);

  return (
    <header
      ref={headerRef}
      id="site-header"
      className="site-header fixed inset-x-0 top-0 z-50"
      // data-home is read by CSS: no attribute at all means "not the home page".
      data-home={pathname === "/" ? "true" : undefined}
      // A keyboard user tabbing into a hidden header should see it.
      onFocus={revealHeader}
    >
      <div className="site-header__bar gutter">
        <Link href="/" className="site-header__brand" aria-label={`${siteConfig.name} — home`}>
          <Image src="/brand/logo.png" alt="" width={56} height={56} preload className="site-header__logo" />
          <span className="font-plush site-header__name">{siteConfig.shortName}</span>
        </Link>

        <nav aria-label="Main" className="site-header__nav">
          <ul>
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} active={isActivePath(pathname, item.href)} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__end">
          <Button
            variant="whatsapp"
            size="compact"
            href={generalWhatsAppLink}
            className="hidden md:inline-flex"
          >
            WhatsApp us
          </Button>
          <MobileMenu />
        </div>
      </div>

      <HeaderHem />
    </header>
  );
}

/** Scalloped hem hanging under the bar. Fades in together with the milk background. */
function HeaderHem() {
  return (
    <svg aria-hidden="true" className="site-header__hem" width="100%" height="14" preserveAspectRatio="none">
      <defs>
        <pattern id="header-hem" width="44" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 0H44V2A22 11 0 0 1 0 2Z" className="site-header__hem-fill" />
          <path d="M0 2A22 11 0 0 0 44 2" className="site-header__hem-line" />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill="url(#header-hem)" />
    </svg>
  );
}
