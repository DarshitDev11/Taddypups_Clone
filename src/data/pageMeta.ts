// <title> and description for each static route, plus the h1 used by the placeholder pages.
// The root layout adds the " | TeddyPups U.A.E." suffix to every title except the home page.

export interface PageMeta {
  path: string;
  /** Short title (no site suffix). */
  title: string;
  description: string;
}

export const pageMeta = {
  home: {
    path: "/",
    title: "TeddyPups U.A.E. — Premium teacup puppies in Dubai",
    description:
      "Teddy bear and teacup puppies in Dubai. Meet local puppies in our Downtown Dubai showroom or bring home a rare breed imported from trusted breeders.",
  },
  puppies: {
    path: "/puppies",
    title: "Available puppies",
    description:
      "Teacup and teddy bear puppies available now in Dubai and imported from trusted breeders — every listing shows real photos of the puppy.",
  },
  goneHome: {
    path: "/gone-home",
    title: "Gone home",
    description: "TeddyPups puppies who have already joined their families.",
  },
  happyFamilies: {
    path: "/happy-families",
    title: "Happy families",
    description: "Real photos shared by TeddyPups families after welcoming their new puppy home.",
  },
  howItWorks: {
    path: "/how-it-works",
    title: "How it works",
    description:
      "Meet a local puppy in our Downtown Dubai showroom or reserve a premium teacup breed imported for you — every step, from choosing to coming home.",
  },
  faq: {
    path: "/faq",
    title: "Questions & answers",
    description:
      "Answers about TeddyPups puppies: health checks and vaccinations, meeting local puppies, imported teacup breeds and delivery.",
  },
  contact: {
    path: "/contact",
    title: "Visit & contact",
    description: "Visit TeddyPups in Downtown Dubai or get in touch on WhatsApp, by phone or email.",
  },
} satisfies Record<string, PageMeta>;
