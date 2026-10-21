# TeddyPups Clone — Project Plan

> Insta Biz Web technical assignment: clone https://puppy.instabizweb.com/
> Deliverables: live URL, GitHub repo, Loom video (process, structure, stack, AI tools + exact prompts, decisions, challenges, testing, deployment).
> This is a living document — edit it as requirements change.

---

## 0. Status

| Item | Status |
|---|---|
| Source research (HTML, CSS, sitemap, routes) | ✅ Done (see §1) |
| Visual research in a real browser (screenshots, animations, breakpoints) | ✅ Done → `research/DESIGN-SPEC.md` (see §1b) |
| Project scaffold | ⏳ |
| Pages | ⏳ |
| Contact form backend | ⏳ |
| Admin panel (bonus) | ⏳ |
| Deploy + README + Loom | ⏳ |

---

## 1. Research findings (what the reference site is)

Found by downloading and reading the public HTML, CSS, `sitemap.xml` and `robots.txt`. No private endpoints were touched.

### Tech stack (from response headers + markup)
- **Next.js** (App Router, React Server Components — `x-powered-by: Next.js`, `self.__next_f`, prerendered pages)
- **Tailwind CSS v4** (utility classes in markup, `--color-*` / `--font-*` theme variables)
- **next/image** for all images, **next/font** for self-hosted fonts
- Probably **Lenis** (smooth scroll) and some **Motion** (framer-motion) animations — confirm in the browser
- Behind **Cloudflare**; strict CSP headers
- **Separate backend/admin** at `bkpuppy.instabizweb.com/admin` (login-protected) → puppies come from a database/CMS. `robots.txt` disallows `/admin` and `/api`.

### Brand
- Name: **TeddyPups U.A.E.** — "every puppy is family". Dubai-based seller of miniature/teacup puppies.
- Tagline in footer: "Home, at last."

### Design tokens (exact values from their CSS)
| Token | Value | Use (guess) |
|---|---|---|
| `cocoa` | `#2a170e` | main text, dark buttons, borders |
| `cocoa-soft` | `#5a3a28` | secondary text |
| `milk` | `#fffdf8` | page background |
| `honey` | `#f2be6b` | accent, focus ring |
| `honey-soft` | `#fbe3b4` | soft accent backgrounds |
| `toffee` | `#c2622b` | primary CTA |
| `toffee-deep` | `#a24a1a` | CTA hover |
| `toffee-ink` | `#8e3f15` | accent text |
| `blush` | `#f9cdbf` | pink accent sections |
| `sky` | `#bfddf5` | blue accent sections |
| `sky-deep` | `#2f6e9e` | blue text |

### Fonts
- **Fraunces** — display/headings (`--font-display`)
- **Figtree** — body (`--font-sans`)
- **Shantell Sans** — handwritten accents like "hello, it's me", "where to, friend?" (`--font-hand`)

### Routes
| Route | Main content |
|---|---|
| `/` | Hero ("Premium teacup…", "Meet the pups"), Two ways to meet your puppy (Puppies in Dubai / Imported for you), Your puppy journey (Choose breed → Get photos & details → Secure delivery), Why families trust TeddyPups, Happy families & puppies, FAQ ("Questions, answered"), final CTA ("Ready to meet your new best friend?") |
| `/puppies` | "Available puppies" grid + "Already gone home" section; cards show name, breed, sex, status |
| `/puppies/[slug]` | ~45 puppies (full list in `sitemap.xml`). Image gallery (‹ 1/4 ›), status badge, name, details table (Breed, Boy or girl, Age, Where), "Ask about X on WhatsApp", "Send an enquiry", "Every Teddy Pup comes…" (Vaccinated, Dewormed, Health certificate, Checked), "Coming home from abroad" steps (Reserve → Consultation → Import & arrival → Welcome home), "Ask about X" form |
| `/gone-home` | Grid of puppies already sold |
| `/happy-families` | Customer photos / testimonials |
| `/how-it-works` | Two ways home; meet in person (Explore → Choose → Meet → Pick-up/delivery); order on request (Reserve → Consultation → Import → Welcome); premium puppy promise; Delivery & collection |
| `/faq` | 9 questions in an accordion (vaccinated?, meet first?, same day?, import?, how imported pups travel, photos first?, delivery?, breeds?, after-care?) |
| `/contact` | "Get in touch with us" form + "Visit us in Downtown Dubai" |

### Shared UI
- **Header:** logo, nav (Home, Puppies, Happy families, How it works, FAQ, Visit & contact), "WhatsApp us" button; on mobile a "Menu" button opens a full-screen dialog ("where to, friend?").
- **Footer:** "Home, at last.", about text, Explore links, Say hello (WhatsApp, phone, email, address), Instagram/TikTok/Facebook, ©.
- **Sticky mobile bar:** "WhatsApp us" + "Call".
- "Skip to content" link (accessibility).

### Contact / enquiry form fields
`name` (required, 2–80), `phone` (required, tel, "+971 50 123 4567"), `email` (optional), `area` (optional), `puppyId` (select), `message` (textarea, max 2000), hidden `website` field (honeypot spam trap).

---

## 1b. Visual research findings (2026-10-21) — this changes the scope

Full details with exact numbers: **`research/DESIGN-SPEC.md`**. Supporting files: `research/content.md` (all copy), `research/puppies.json` (42 puppies: 15 available, 27 gone home), `research/happy-families.json` (64 photos), `research/assets/` (images, 151 SVGs, 6 videos), `research/screenshots/` (77 named + 186 scroll-step shots — use `steps/` for the home page).

**The site is a scroll-driven "storybook", not a plain marketing site.** The home page goes from morning to night as you scroll, each section is an illustrated scene, and a cartoon mascot follows you.

| Feature | What it is | Effort | Priority |
|---|---|---|---|
| Fonts with variable axes | Fraunces `SOFT 100, WONK 1, opsz 144` (800, −0.025em, lh .92); Shantell `INFM 60, BNCE 30` | Low | **Must** |
| Header | Hides on scroll down (>220px), shows on scroll up; transparent on home, scalloped hem elsewhere | Low | **Must** |
| Mobile menu | `<dialog>` with circle-reveal animation | Low | **Must** |
| Dark footer | Wavy hill top, stars, moon, "Home, at last.", Teddy in a basket | Medium | **Must** |
| Sticky mobile bar | WhatsApp + Call, <768px | Low | **Must** |
| Home "Meet the pups" | Arched doors; ≥1024px pinned horizontal scroll, doors swing open; <1024 grid | High | **Must** |
| /puppies sketchbook | Wobbly ink outlines, blob photo masks, doodles; filters (where / breed / boy-girl) synced to URL | Medium | **Must** |
| Puppy detail | Gallery + lightbox (Motion), videos, tag card, bookmark ribbon, enquiry form | Medium | **Must** |
| Page designs | gone-home tickets, happy-families polaroid wall + lightbox, FAQ corkboard + search, contact letter form | Medium each | **Must** (simplify animations if late) |
| Scroll animations | CSS `animation-timeline: view()` (doors, stamps, sun, house door) | Medium | Should |
| Route "curtain" transition | Overlay with lattice, scalloped edges, running puppy (~1s first load, 0.3s/0.46s on nav) | Medium | Should |
| Smooth scroll | Lenis, desktop only (`lerp 0.1`, `wheelMultiplier 0.85`) | Low | Should |
| Teddy mascot actor | Fixed mascot walking between "stops" with poses + speech bubbles | **Very high** | Could — start with a static Teddy at each scene, add movement last |
| Paw cursor + canvas paw trail | Custom cursor | Low–Medium | Could |
| 404 "LOST" poster | Custom 404 page | Low | Could |

**Corrections to §1:** there are **42** puppy detail pages (not ~45). Extra libraries: **Lenis** + **Motion**.
**Not captured** (we didn't submit forms): contact "fold letter into mailbox" and enquiry success/error animations — built from their CSS only.

---

## 2. Research still to do (in a real browser)
- [ ] Full-page screenshots of every route at **375 / 768 / 1024 / 1440px** → save in `research/screenshots/`
- [ ] Note animations: hero entrance, scroll reveals, hover states, gallery swipe, menu open/close, smooth scroll
- [ ] Check the `/puppies` page for filters/sorting (breed, sex, location)
- [ ] Measure spacing, radii, shadows, button sizes in DevTools
- [ ] Check what happens after a form submit (success message? redirect?) — use the UI only, don't send fake data to their real business
- [ ] Collect puppy data (name, breed, sex, age, where, status, images) → `data/puppies.json`

**Rules:** only use publicly visible pages. Don't touch their `/admin` or `/api`. Rebuild the code ourselves; don't copy their compiled JS bundles.

---

## 3. Our tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | Same as original; SSG + SEO |
| Styling | Tailwind CSS v4 | Same as original; copy tokens 1:1 |
| Fonts | `next/font/google` (Fraunces, Figtree, Shantell Sans) | Same fonts, self-hosted |
| Animation | Motion (framer-motion) + Lenis + CSS scroll-driven animations | Same as original (confirmed in research) |
| Forms | Server Actions + zod | Validation on server |
| Database (bonus) | Supabase Postgres (or SQLite + Prisma) | Puppies + enquiries, admin CRUD |
| Email (optional) | Resend | Send enquiry notifications |
| Hosting | Vercel | Free, auto-deploy from GitHub |

---

## 4. Folder structure (planned)

```
teddypups-clone/
├── PLAN.md
├── PROMPTS.md            # log every AI prompt used (needed for the Loom)
├── README.md
├── research/screenshots/
├── public/
│   ├── brand/logo.png
│   └── puppies/<slug>/1.jpg …
├── data/puppies.json     # seed data
└── src/
    ├── app/
    │   ├── layout.tsx            # fonts, header, footer, sticky mobile bar
    │   ├── page.tsx              # home
    │   ├── puppies/page.tsx
    │   ├── puppies/[slug]/page.tsx
    │   ├── gone-home/page.tsx
    │   ├── happy-families/page.tsx
    │   ├── how-it-works/page.tsx
    │   ├── faq/page.tsx
    │   ├── contact/page.tsx
    │   ├── admin/…               # bonus
    │   ├── sitemap.ts
    │   └── robots.ts
    ├── components/
    │   ├── layout/ (Header, MobileMenu, Footer, StickyBar)
    │   ├── ui/ (Button, Section, Badge, Accordion)
    │   ├── puppy/ (PuppyCard, PuppyGrid, Gallery, DetailsTable)
    │   └── forms/ (EnquiryForm)
    ├── lib/ (puppies.ts, whatsapp.ts, validation.ts)
    └── styles/globals.css        # Tailwind @theme tokens
```

---

## 5. Build phases (≈ 2 days)

### Phase 1 — Setup & visual capture (~2h)
- [ ] `create-next-app` (TS, Tailwind, App Router, src dir), `git init`, push to GitHub
- [ ] Add colour tokens + fonts to `globals.css` / `layout.tsx`
- [ ] Browser research from §2, screenshots, `data/puppies.json`, download images

### Phase 2 — Layout & UI kit (~2h)
- [ ] Header + mobile menu dialog, Footer, sticky mobile WhatsApp/Call bar, skip link
- [ ] Button, Section, Badge, Accordion, PuppyCard

### Phase 3 — Pages (~6–8h)
- [ ] Home (section by section)
- [ ] `/puppies` (available + gone home, filters if any)
- [ ] `/puppies/[slug]` with `generateStaticParams`, gallery, details, enquiry form
- [ ] `/how-it-works`, `/faq`, `/gone-home`, `/happy-families`, `/contact`
- [ ] Per-page metadata, Open Graph, `sitemap.ts`, `robots.ts`, 404 page

### Phase 4 — Functionality (~3h)
- [ ] Enquiry/contact form: Server Action, zod validation, honeypot, success/error states
- [ ] Save enquiries (DB) and/or email via Resend
- [ ] WhatsApp deep links with prefilled message per puppy
- [ ] **Bonus:** `/admin` — password login, list/add/edit/delete puppies, view enquiries

### Phase 5 — Polish & testing (~2–3h)
- [ ] Side-by-side comparison with original at every width
- [ ] Animations & hover states
- [ ] Lighthouse (performance, accessibility, SEO ≥ 90), real phone test
- [ ] `npm run build` + `npm run lint` clean

### Phase 6 — Deploy & submit (~2h)
- [ ] Deploy to Vercel, set env vars, test live
- [ ] README (stack, setup, screenshots, live link)
- [ ] Record Loom (outline below)
- [ ] Reply to email with live URL + GitHub + Loom

**If time runs short, priority order:** Home + mobile → puppies list/detail → contact form → other pages → "Should" effects (scroll animations, curtain, Lenis) → mascot movement → admin. See the priority column in §1b.

> ⚠️ Time check: with the storybook design (§1b), Phase 3 is realistically **10–14h**, not 6–8h. Build all pages to look right first, then layer in animations.

---

## 6. Loom outline (10–15 min)
1. Live demo — desktop + mobile
2. How the original was analysed (DevTools, page source, sitemap, CSS tokens)
3. Tech stack + why
4. Folder structure walkthrough
5. AI tools used + exact prompts (from `PROMPTS.md`)
6. Key decisions (data model, static generation, form handling, admin)
7. Challenges + how they were solved
8. Testing (responsive, Lighthouse, build)
9. Deployment (GitHub → Vercel)

---

## 7. Notes / decisions
- Use a **placeholder WhatsApp number / email** and a small "demo clone" note in the footer, so it isn't mistaken for the real business.
- Keep `PROMPTS.md` updated as we go — the Loom must show exact prompts.
- Open questions:
  - [ ] Build the admin panel or skip? (decide after Phase 4 based on time)
  - [ ] Database: Supabase vs local JSON only?
