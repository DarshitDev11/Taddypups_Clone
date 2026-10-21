import type { Metadata, Viewport } from "next";
import { figtree, fraunces, shantellSans } from "@/app/fonts";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { PageTransition } from "@/components/layout/PageTransition";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { pageMeta } from "@/data/pageMeta";
import { siteConfig } from "@/data/siteConfig";
import "./globals.css";

export const metadata: Metadata = {
  // Relative URLs in metadata (canonical, og:image) are resolved against this.
  metadataBase: new URL(siteConfig.url),
  title: { default: pageMeta.home.title, template: `%s | ${siteConfig.name}` },
  description: pageMeta.home.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: pageMeta.home.title,
    description: pageMeta.home.description,
    images: ["/brand/logo.png"],
  },
  twitter: { card: "summary_large_image" },
  // The favicon and apple icon come from app/icon.png and app/apple-icon.png.
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the sticky mobile bar use env(safe-area-inset-bottom) on notched phones.
  viewportFit: "cover",
  themeColor: "#fffdf8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${figtree.variable} ${fraunces.variable} ${shantellSans.variable}`}>
      <body>
        <SkipLink />
        <PageTransition />
        <SmoothScroll />
        <SiteHeader />
        {/* Padding clears the fixed header; tabIndex lets the skip link move focus here. */}
        <main id="main" tabIndex={-1} className="relative pt-[var(--header-h)] outline-none">
          {children}
        </main>
        <SiteFooter />
        <MobileActionBar />
      </body>
    </html>
  );
}
