// Single source of truth for brand details, contact info, socials and navigation.
// Change the placeholder contact details here and every component picks them up.

export const siteConfig = {
  name: "TeddyPups U.A.E.",
  /** Short name used for the wordmark next to the logo. */
  shortName: "TeddyPups",
  tagline: "every puppy is family",
  footerHeadline: "Home, at last.",
  description:
    "TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.",
  /** Public site address, used for canonical URLs, the sitemap and WhatsApp messages. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** PLACEHOLDER details: this project is a demo clone, so it must not reach the real business. */
  contact: {
    /** Digits only, with country code, as wa.me expects. */
    whatsappNumber: "971500000000",
    phoneDisplay: "+971 50 000 0000",
    phoneHref: "tel:+971500000000",
    email: "hello@teddypups-demo.com",
    address: "Downtown Dubai, United Arab Emirates",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Downtown+Dubai",
  },

  /** PLACEHOLDER links: the demo clone must not point at the real business's accounts. */
  socials: [
    { label: "Instagram", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "Facebook", href: "#" },
  ],

  /** Header and mobile-menu links. */
  nav: [
    { label: "Home", href: "/" },
    { label: "Puppies", href: "/puppies" },
    { label: "Happy families", href: "/happy-families" },
    { label: "How it works", href: "/how-it-works" },
    { label: "FAQ", href: "/faq" },
    { label: "Visit & contact", href: "/contact" },
  ],

  /** "Explore" column in the footer. */
  footerNav: [
    { label: "Available puppies", href: "/puppies" },
    { label: "Gone home", href: "/gone-home" },
    { label: "Happy families", href: "/happy-families" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Delivery & collection", href: "/how-it-works#delivery" },
    { label: "FAQ", href: "/faq" },
    { label: "Visit & contact", href: "/contact" },
  ],
} as const;

export type NavLink = { readonly label: string; readonly href: string };
