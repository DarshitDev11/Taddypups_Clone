// The 404 "LOST" poster: a missing-pet notice for the page, with Teddy and tear-off tabs that link home.

import { MaskingTape } from "@/components/decor/MaskingTape";
import { Teddy } from "@/components/decor/Teddy";
import Link from "next/link";

/** The tabs hang off the bottom of the poster, one link each. */
const TABS = [
  { label: "Home", href: "/" },
  { label: "Puppies", href: "/puppies" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Questions", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function LostPoster() {
  return (
    <article className="poster">
      <MaskingTape variant="left" color="#f6d79a" />
      <MaskingTape variant="right" color="#f6d79a" />

      <p className="font-scrawl poster__kicker">have you seen this page?</p>
      <h1 className="font-plush poster__title">Lost</h1>

      <div className="poster__photo">
        <Teddy pose="walk" facing="right" label="Teddy, sniffing out the missing page" />
      </div>

      <p className="poster__desc">
        One page, last seen wandering off. It answers to the address you typed, but it isn&apos;t here any
        more. Teddy is on the case.
      </p>

      <p className="font-scrawl poster__reward">if found, take a tab:</p>
      <ul className="poster__tabs">
        {TABS.map((tab) => (
          <li key={tab.href}>
            <Link href={tab.href} className="poster__tab">
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
