# TeddyPups U.A.E. — clone

A pixel-accurate rebuild of [puppy.instabizweb.com](https://puppy.instabizweb.com/), a Dubai puppy seller's
storybook-style site, made as a technical assignment. Every contact detail is a **placeholder**
(see [Placeholder contact details](#placeholder-contact-details)); this project is not the real business.

**Live site:** https://taddypupps.netlify.app

> Status: all pages are built (home, puppies, puppy detail, gone home, happy families, how it works, FAQ,
> contact, 404), including the live Teddy mascot, paw-print cursor trail and photo lightboxes.

## Tech stack

| Layer     | Choice                                                                                    |
| --------- | ----------------------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack) with React 19 and TypeScript                           |
| Styling   | Tailwind CSS v4 (tokens in `@theme`) plus plain CSS for stateful bits                     |
| Fonts     | `next/font/google`: Fraunces (SOFT, WONK, opsz axes), Shantell Sans (BNCE, INFM), Figtree |
| Scrolling | Lenis smooth scroll (mouse pointers only)                                                 |
| Data      | Typed TypeScript files in `src/data` (no database yet)                                    |
| Quality   | ESLint (`eslint-config-next`), Prettier, `tsc --noEmit`                                   |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                           |
| `npm run build`     | Production build (statically generates all 55 pages) |
| `npm start`         | Serve the production build                           |
| `npm run lint`      | ESLint                                               |
| `npm run typecheck` | TypeScript check without emitting files              |
| `npm run format`    | Prettier over the whole project                      |

Optional: copy the site address into `.env.local` so sitemap, canonical URLs and WhatsApp messages use it
(defaults to `http://localhost:3000`):

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

## Folder structure

```
src/
├── app/                 Routes (App Router) and the root layout
│   ├── layout.tsx       Fonts, header, footer, mobile bar, metadata
│   ├── globals.css      Imports Tailwind and everything in src/styles
│   ├── fonts.ts         The three next/font declarations
│   ├── page.tsx         /
│   ├── puppies/         /puppies and /puppies/[slug] (static, one page per puppy)
│   ├── gone-home/  happy-families/  how-it-works/  faq/  contact/
│   ├── not-found.tsx    404 page
│   └── sitemap.ts  robots.ts
├── components/
│   ├── layout/          Site shell: SiteHeader, MobileMenu, SiteFooter, MobileActionBar, SkipLink,
│   │                    SmoothScroll, PageTransition (placeholder), NavLink
│   ├── ui/              Reusable building blocks: Button, Container, Section, PageHeader,
│   │                    HandwrittenLabel, Badge (Chip, VideoPill), StatusTag, ScallopEdge
│   ├── decor/           SVG illustrations: Teddy (poses), Basket, icons (paw, heart, sparkle, check), Doodles
│   ├── home/            Home-page scenes (empty for now)
│   ├── puppies/         Puppy cards, gallery, filters (empty for now)
│   └── forms/           Enquiry and contact forms (empty for now)
├── data/                Typed content: puppies, happyFamilies, faqs, siteConfig, pageMeta, puppyFilters
├── hooks/               Small client hooks (useHeaderScrollState)
├── lib/                 Pure helpers: puppies queries, whatsapp links, metadata, navigation, cn()
├── styles/              CSS split by purpose: theme, base, utilities, components, shell
└── types/               Puppy, HappyFamilyPhoto
public/
├── brand/               Logo
├── puppies/<slug>/      Photos and video posters, numbered 01, 02, ...
├── videos/              Puppy videos (.mp4)
├── families/            Happy-family photos
└── svg/                 Cursor SVGs
docs/ARCHITECTURE.md     How it fits together and conventions for new code
research/                Notes from analysing the original site (design spec, copy, data)
PLAN.md  PROCESS.md      Project plan and a plain-English account of the process
```

## Placeholder contact details

The phone, WhatsApp number and email are fake on purpose, so nobody contacts the real business by accident.
They live in **one file**, `src/data/siteConfig.ts`:

- WhatsApp / phone: `+971 50 000 0000` (`wa.me/971500000000`)
- Email: `hello@teddypups-demo.com`

The footer also says "Demo clone for a technical assignment". The social links still point at the original
business's public profiles; swap them in `siteConfig.socials` if you prefer.

## Assets

Images and videos were downloaded from the original site during research and copied to `public/` with clean
names. The original quality is kept, so the folder is large (about 36 MB of family photos, 12 MB of puppy
photos). `next/image` resizes and compresses them when served. The largest video is 6.5 MB, so none is over
10 MB; compress `public/videos/maltipoo-female-2-06.mp4` and `-07.mp4` (the biggest) before deploying if
bandwidth matters.

## Regenerating data

`src/data/puppies.ts` and `src/data/happyFamilies.ts` are generated from the research JSON by
`node research/scripts/generate-data.mjs`. That script also copies the media into `public/`. You only need it
if the research data changes (the research captures themselves are not committed).
