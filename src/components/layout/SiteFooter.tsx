// Dark night-time footer: wavy hill, twinkling stars and moon, "Home, at last.", Teddy asleep in a basket,
// link columns, contact details, socials and the copyright row.

import Image from "next/image";
import Link from "next/link";
import { Basket } from "@/components/decor/Basket";
import { SparkleIcon } from "@/components/decor/icons";
import { HandwrittenLabel } from "@/components/ui/HandwrittenLabel";
import { siteConfig } from "@/data/siteConfig";
import { generalWhatsAppLink } from "@/lib/whatsapp";

/** Position (% of the sky area), width (px) and twinkle delay (s) of each star. */
const STARS = [
  { left: "6%", top: "18%", size: 12.6, delay: 0 },
  { left: "14%", top: "42%", size: 8.4, delay: 0.4 },
  { left: "23%", top: "12%", size: 9.8, delay: 0.8 },
  { left: "31%", top: "30%", size: 7, delay: 1.2 },
  { left: "44%", top: "9%", size: 11.2, delay: 1.6 },
  { left: "52%", top: "36%", size: 7.7, delay: 2 },
  { left: "63%", top: "15%", size: 10.5, delay: 2.4 },
  { left: "71%", top: "40%", size: 7, delay: 2.8 },
  { left: "92%", top: "33%", size: 8.4, delay: 3.2 },
];

const footerLinkClass = "font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline";

export function SiteFooter() {
  const { contact } = siteConfig;
  // Evaluated at build time, which is fine for a static site.
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-night pb-[calc(var(--bar-h)+2rem)] text-milk md:pb-10">
      {/* The hill sits above the footer's top edge and overlaps the page content. */}
      <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className="footer-hill">
        <path d="M0 80V44c120-30 240-44 360-30s240 46 360 34 240-58 360-46 240 40 360 26v52z" />
      </svg>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 h-64 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          {STARS.map((star) => (
            <SparkleIcon
              key={star.left}
              className="twinkle absolute text-honey"
              style={{ left: star.left, top: star.top, width: star.size, animationDelay: `${star.delay}s` }}
            />
          ))}
        </div>
        <span className="footer-moon" />
      </div>

      <div className="gutter relative mx-auto grid max-w-page gap-12 pt-20 md:grid-cols-12 md:gap-x-12 md:gap-y-6 md:pt-28">
        <div className="md:col-span-5">
          <p className="font-plush text-big text-honey-soft">{siteConfig.footerHeadline}</p>
          <p className="mt-5 max-w-md text-milk/80">{siteConfig.description}</p>
        </div>

        {/* On phones the basket drops to the bottom; on desktop it sits under the headline. */}
        <div className="order-last md:order-none md:col-span-5 md:col-start-1 md:row-start-2">
          <Basket />
        </div>

        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7 md:row-span-2 md:row-start-1">
          <HandwrittenLabel as="h2" tone="inherit" className="text-lg text-honey">
            Explore
          </HandwrittenLabel>
          <ul className="mt-4 space-y-2.5">
            {siteConfig.footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={footerLinkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3 md:row-span-2 md:row-start-1">
          <HandwrittenLabel as="h2" tone="inherit" className="text-lg text-honey">
            Say hello
          </HandwrittenLabel>
          <ul className="mt-4 space-y-2.5 text-milk/90">
            <li>
              <a
                href={generalWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-honey"
              >
                WhatsApp {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="break-all hover:text-honey">
                {contact.email}
              </a>
            </li>
            <li>{contact.address}</li>
          </ul>

          <ul aria-label="Social media" className="mt-6 flex flex-wrap gap-3">
            {siteConfig.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center rounded-full border-2 border-milk/30 px-4 text-sm font-semibold hover:border-honey hover:text-honey"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="gutter relative mx-auto mt-16 flex max-w-page flex-col items-start justify-between gap-4 border-t border-milk/15 pt-6 text-sm text-milk/60 md:flex-row md:items-center">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Image src="/brand/logo.png" alt="" width={36} height={36} className="size-9" />
          <span>
            © {year} {siteConfig.name}
          </span>
          <span aria-hidden="true" className="max-md:hidden">
            ·
          </span>
          <span>Demo clone for a technical assignment</span>
        </span>
        <span className="font-scrawl text-base text-honey/80">{siteConfig.tagline}</span>
      </div>
    </footer>
  );
}
