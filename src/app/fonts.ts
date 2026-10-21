// The three brand fonts, self-hosted by next/font at build time (no request to Google at runtime).
// Each one exposes a CSS variable that styles/theme.css maps to font-sans / font-display / font-hand.

import { Figtree, Fraunces, Shantell_Sans } from "next/font/google";

/** Body text. */
export const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  display: "swap",
  variable: "--font-figtree",
});

/**
 * Headings. The extra axes are what give the "plush" look:
 * SOFT = rounded terminals, WONK = quirky letterforms, opsz = optical size.
 * The values themselves are set in the `font-plush` utilities (styles/utilities.css).
 */
export const fraunces = Fraunces({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: "variable",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

/** Handwritten accents. INFM = informality, BNCE = bounce. */
export const shantellSans = Shantell_Sans({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  axes: ["BNCE", "INFM"],
  display: "swap",
  variable: "--font-shantell",
});
