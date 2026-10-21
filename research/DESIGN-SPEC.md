# DESIGN-SPEC — pixel-accurate clone of https://puppy.instabizweb.com/ ("TeddyPups U.A.E.")

Research only. No app code was written. Everything here was measured in headless Chromium (Playwright) against the public site on 2026-10-21. Numbers are computed styles / bounding boxes unless marked *(from CSS)*.

Paths are relative to `/home/darshit/Projects/teddypups-clone/research/`.

---

## 0. READ THIS FIRST — what this site actually is

PLAN.md describes a normal marketing site. It is not. It is a **scroll-driven "storybook / day-to-night" site** with a cartoon mascot called **Teddy** (a golden poodle-ish pup) that follows you down the page. The home page is a single long "day": warm morning cream → golden afternoon → sunset → dusk → night. Each home section is a themed *scene* with its own sky gradient and illustrated props (doors, signpost, phone, passport book, polaroid wall, front door with a lamp, etc.). Inner pages reuse the same illustrated vocabulary (sketchbook, tickets, polaroids, corkboard, letter, "lost" poster).

**Most important findings that are NOT in PLAN.md**

1. **Stack extras:** Lenis smooth-scroll (desktop pointer only: `lerp 0.1`, `wheelMultiplier 0.85`), Motion/framer-motion (lightbox springs, `reducedMotion:"user"`), CSS scroll-driven animations (`animation-timeline: view()` for door-open, stamps, sun-set, house door), a `<canvas>` paw-print cursor trail, a custom paw cursor, and `<dialog>` for the mobile menu + photo lightbox. Fonts use **variable axes**: Fraunces `SOFT 100, WONK 1, opsz 144` (weight 800, letter-spacing −0.025em, line-height 0.92) and Shantell Sans `INFM 60, BNCE 30` (weight 500). Without those axes the headings will not look right.
2. **Route "curtain" page transition** (fixed overlay, honey-soft blanket with diamond lattice + scalloped edges, a puppy running L→R leaving paw prints, text "every puppy is family"). Plays on first load (≈1.04 s) and on every internal link click (≈0.3 s cover, load, 0.46 s lift). See §2.9.
3. **Teddy mascot is a live fixed-position actor** (`.pup-layer`) that walks between "stops" while you scroll (hero peek-a-boo behind the quilt → treadmill on the doors floor → sits at signpost, by phone, on the passport book, by the speech note, tilts at FAQ, bows at the front door → ends snug in a basket in the footer). Poses: `peek, walk, sit, sniff, snug, bow`. Speech bubbles ("ooh, photos!", "home soon!", "woof!", "hm?"), hearts on pet/click. On <768 px it switches to "lane" mode (peeks from the screen edge above the sticky bar). See §3.6.
4. **Home "Meet the pups" is a horizontal-scroll pinned section on ≥1024 px** (vertical scroll drives `translateX` of a row of arched doors; doors swing open as they pass Teddy and reveal the puppy photo). On <1024 it is a plain responsive grid of doors that open on scroll-into-view (`view()` timeline).
5. **/puppies is not a plain grid** — it is a "sketchbook": hand-drawn wobbly ink outlines + organic blob photo masks + per-puppy doodles (paw, heart, sparkle, swirl, dashes), drawn on with stroke-dashoffset when revealed. It has **working client-side filters** (3 sticker-chip rows) synced to the URL (`?origin=imported&collection=korean-teacup&breed=maltipoo&gender=male`).
6. **Header** hides on scroll-down (>220 px) and returns on scroll-up; on the home page it is transparent until scrolled, on other pages it always has a milk background with a **scalloped hem** under it.
7. **Dark footer** with a wavy "hill" top edge, twinkling stars, a crescent moon, "Home, at last.", and a basket with Teddy in it. Mobile has a **sticky bottom bar** (WhatsApp + Call) <768 px.
8. **Page-specific designs:** gone-home = "admit one" ticket stubs; happy-families = polaroid masonry wall with tape + lightbox; faq = corkboard with pinned note cards that "unfold" (search box filters + highlights); contact = fill-in-the-blanks **letter** form that folds into an envelope and posts into a mailbox on submit; 404 = "LOST" poster with tear-off tabs; puppy detail = storybook page with a bookmark ribbon, tag card, trail of paws.
9. **Gotcha:** `html { scrollbar-gutter: stable }` — that is why a ~15 px strip appears at the right in headless screenshots at every width (viewport 1440 → content 1425).
10. **Full-page screenshots lie for the home page** (pinned section + scroll-linked animation + curtain). Use `screenshots/steps/<page>-<width>/NN-y<scrollY>.png` (viewport shots at stepped scroll positions) as the visual truth.

**How to read the supporting files**

| file | what |
|---|---|
| `raw/css/main.pretty.css` + `raw/css/INDEX.md` | prettified copy of the site's compiled CSS (7.9k lines). INDEX gives line numbers for every `.tp-*`/`.pup-*` rule and every `@keyframes`. The spec quotes it as *(from CSS)*. |
| `raw/rsc/<page>.clean.txt` | decoded Next.js RSC payload per page with exact Tailwind `className` strings and props (base64 stripped). Best source for exact markup. |
| `raw/outline-<page>-<1440|375>.txt` | DOM outline with class names, size and x,y of every element. |
| `raw/measure-<page>-<w>.json` | computed styles of sections + text/button/input elements. |
| `raw/pup-actor.json`, `raw/breakpoints-home.json` | mascot track, stops list, breakpoint behaviour. |
| `puppies.json`, `happy-families.json`, `content.md` | data + copy. |
| `assets/` | brand, svg (151), puppies (132 images), videos (6), happy-families (64). `assets/mapping.json` = source URL → file. |
| `screenshots/` | 77 named shots + 186 scroll-step shots. |

---

## 1. Screenshot index

Full-page: `screenshots/<route>-<375|768|1024|1440>.png` for `home, puppies, puppy-copper-male, gone-home, happy-families, how-it-works, faq, contact` (32 files). **home-* full-page images are unreliable** (blank bands where scroll-driven things are pinned).
Scroll-step viewport shots: `screenshots/steps/<route>-1440/` (viewport 1440x900, step 765 px) and `screenshots/steps/<route>-375/` (375x812, step 690 px).
Specials:
- Header: `desktop-header-1440.png`, `desktop-header-scrolled-1440.png`, `header-hidden-on-scroll-down-1440.png`, `header-shown-on-scroll-up-1440.png`
- Mobile menu: `mobile-menu-opening-375.png` (circle reveal mid-animation), `mobile-menu-open-375.png`, `mobile-menu-closing-375.png`, `mobile-home-viewport-375.png` (sticky bar)
- Buttons: `button-rest-1440.png`, `button-hover-1440.png`
- Curtain: `curtain-intro-{150,350,600,800}ms-1440.png`, `curtain-nav-{120,260,420,700}ms-1440.png`
- FAQ: `faq-expanded-1440.png`, `faq-search-korea-1440.png`
- Puppy detail: `puppy-gallery-1-1440.png`, `puppy-gallery-2-1440.png` (after Next), `puppy-gallery-thumb3-1440.png`, `puppy-lightbox-1440.png`, `puppy-lightbox-next-1440.png`, `puppy-video-gallery-1440.png`, `puppy-gone-detail-top-1440.png`, `puppy-gone-detail-mid-1440.png`
- Cards/filters: `card-hover-1440.png`, `puppies-filter-imported-1440.png`, `puppies-filter-imported-boys-1440.png`, `puppies-filter-empty-1440.png`
- Happy lightbox: `happy-viewer-1440.png`; How-it-works imported tab: `how-it-works-imported-tab-1440.png`; 404: `404-1440.png`
- Breakpoint heroes: `home-viewport-{375,640,768,1024,1280,1440,1920}.png`; real-touch mobile: `mobile-real-puppies-viewport-375.png`, `mobile-real-faq-viewport-375.png`

---

## 2. GLOBAL

### 2.1 Tokens (Tailwind v4 `@theme`) — exact

Colours (already in PLAN, confirmed): `cocoa #2a170e`, `cocoa-soft #5a3a28`, `milk #fffdf8`, `honey #f2be6b`, `honey-soft #fbe3b4`, `toffee #c2622b`, `toffee-deep #a24a1a`, `toffee-ink #8e3f15`, `blush #f9cdbf`, `sky #bfddf5`, `sky-deep #2f6e9e`.

**Literal colours used outside the theme (needed for pixel accuracy):**

| value | use |
|---|---|
| `#1f7a4d` | WhatsApp button bg, phone-compose send icon bg |
| `#1f6b45` | green stamp ink ("Korea to Dubai, safely") |
| `#24130b` | footer / `--night`; end of final scene gradient |
| `#3b2215` | door frame inner, lamp post, pavement base `#3a2114` |
| `#fff8ea` | passport/"paper" page bg, ticket bg |
| `#fffefb` | polaroid bg; `#fffcf3→#fff5e2` FAQ note gradient; `#fff6df` lost poster |
| `#ffd27f` | sun + street-lamp glow, `#ffd98f` house peephole |
| `#e4a85b→#d38f45` | wooden signpost; `#dc9a52/#e8b06a` doors floor; `#b2733f` door-frame ring |
| `#c99a62` (+`#8a5a33`) | corkboard; `#80482a→#6c3b22` + `#5a301b` photo-wall wood |
| `#b3261e` | error red (invalid inputs) |
| `rgba(42,23,14,α)` | all lines/shadows: .07 lattice, .14/.16 chip shadow, .25–.4 borders, .14 hard shadows |
| door colours cycle | `#b8644a, #d4893f, #a24a1a, #7a4a2e, #5a3a28` (`--door` per door) |
| puppy-sketch `--wash` | cycle of `#bfddf5, #fbe3b4, #f9cdbf, #f2be6b, #e8c39a` |
| stamp inks | `#a24a1a, #1f6b45, #5a3a28, #c2622b` (`--ink-stamp`) |

**Scene sky gradients (home)** — `linear-gradient(to bottom, var(--sky-top), var(--sky-bottom))` per `section.tp-scene`:

| scene | top → bottom | tone (`--ink`) |
|---|---|---|
| hero | `#fffdf8 → #fff1d8` (also `--quilt:#fff1d8`) | dark text |
| meet | `#fff1d8 → #fbe3b4` | dark text |
| paths | `#fbe3b4 → #f7d18d` | dark |
| chat (journey) | `#f7d18d → #f0b866` | dark |
| passport (trust) | `#f0b866 → #a65a30` | dark |
| dusk (families) | `#a65a30 → #4d2b19` | **light** (`--ink:#fffdf8`, `--ink-soft: milk 80%`) |
| night (faq teaser) | `#4d2b19 → #2f1a10` | light |
| home (cta) | `#2f1a10 → #24130b` | light |
| footer | solid `#24130b` | light |

Dark scenes (`data-tone="dark"`) flip `.btn-ghost` to milk border/text (hover fills milk, text cocoa).

Spacing: Tailwind default `--spacing .25rem`. Radii in use: `.5rem, .75rem, 1rem, 1.2rem, 1.4rem, 1.6rem, 1.8rem, 2.2rem, 999px`. Containers: `--container-*` standard; layout max `110rem (1760px)` (`gutter mx-auto max-w-[110rem]`), passport `96rem`, book `72rem`.

### 2.2 Fonts (next/font)

- **Fraunces** variable `100–900`, axes **SOFT, WONK, opsz** (subsets latin/latin-ext/vietnamese). CSS var `--font-display`.
- **Figtree** variable `300–900` (body). `--font-sans`.
- **Shantell Sans** variable `300–800`, axes **BNCE, INFM** (+wght). `--font-hand`.
- Fallbacks: Fraunces → Times New Roman (size-adjust 115.45%), Figtree → Arial, Shantell → Arial.

Custom utility classes (reproduce as Tailwind `@utility`):
- `.font-plush` = Fraunces, `font-variation-settings:"SOFT" 100,"WONK" 1,"opsz" 144; letter-spacing:-0.025em; font-weight:800; line-height:.92; text-wrap:balance`
- `.font-plush-text` = Fraunces, `"SOFT" 100,"WONK" 0,"opsz" 36` (used for body-size serif: quotes, card titles; weight inherited 400/700)
- `.font-scrawl` = Shantell Sans, `"INFM" 60,"BNCE" 30; letter-spacing:0; font-weight:500`
- `.text-giant: clamp(3.1rem, 9.4vw, 9.75rem)` · `.text-huge: clamp(2.6rem, 6.4vw, 6.25rem)` · `.text-big: clamp(2rem, 4.2vw, 4rem)` · `.text-lede: clamp(1.125rem,1.4vw,1.375rem)/1.5`
- `.gutter { padding-inline: var(--gutter) }`, `--gutter: clamp(1rem, 4vw, 3.5rem)` (16px @375, 56px @≥1400).

Base: `body { font: 1.0625rem/1.6 Figtree; color cocoa; bg milk; overflow-x: clip; -webkit-font-smoothing:antialiased }` (17px/27.2px). `html { scroll-padding-top: calc(var(--header-h)+1rem); text-rendering:optimizelegibility; scrollbar-gutter:stable; overflow-x:clip }`. `--header-h: 4.75rem` (76px) ≥768, `4rem` <768. `--bar-h: 4rem+safe-area` <768 else 0. `accent-color: toffee-deep`. `::selection` honey bg / cocoa text. `:focus-visible { outline: 3px solid toffee-deep; outline-offset:3px; border-radius:6px }`.

### 2.3 Type scale (measured; desktop 1440 / mobile 375)

| role | font | size 1440 → 375 | lh | ls | weight | colour |
|---|---|---|---|---|---|---|
| hero h1 | plush | **99px** (`clamp(2.6rem,min(9.2vw,11vh),8.4rem)`) → 41.6px | .92 | −.025em | 800 | cocoa |
| section h2 `text-huge` | plush | 92.16px → 41.6px | .92 | −2.3px→−1.04px | 800 | cocoa (milk in dark scenes) |
| page h1 `text-giant` (inner pages) | plush | 135.36px (puppies) → ≈49.6px (3.1rem) | .92 | | 800 | cocoa |
| `text-big` | plush | 60.48px → 32px | .92 | | 800 | cocoa / honey-soft in footer |
| door/card name | plush | 28.8px → 23.2px | 1 | −.025em | 800 | cocoa |
| step title | plush | 33.12 → 25.6px | 1.05 | | 800 | |
| lede | Figtree | 20.16px → 18px | 1.5 | | 400 | cocoa-soft (`--ink-soft`) |
| hero lede | Figtree | 18px → 16.8px | 1.5 | | 400 | cocoa-soft |
| body | Figtree | 17px | 1.6 | | 400 | cocoa / cocoa-soft |
| nav link | Figtree | 16px | 1.6 | | **620** | cocoa; hover toffee-ink; active toffee-deep |
| button | Figtree | 17px (hdr WA 15.2px) | 1.1 | | **650** | |
| hand label | Shantell | 24px (hero note) / 18px (text-lg) / 15.2 / 14.4 (sticker) / 14.72 (polaroid cap) | 1.6 | 0 | 500 | toffee-ink / cocoa-soft |
| meta | Figtree | 14.4–15.2px | | | 600 | cocoa-soft |
| footer link | Figtree | 17px | | | 600 | milk/90 |
| copyright | Figtree | 14px | | | 400 | milk/60 |

### 2.4 Breakpoints (Tailwind v4 defaults + a few custom)

`sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Custom: `min-width:900px` (passport book two-page), `1100px` (4-col steps), `max-width:639px` (mobile-specific lineup/dusk), `max-width:1023px` (ribbon hidden, tags soften), `1680px` (photo-wall centered). JS media: `(max-width:767px)` → lane/mascot-mobile + sticky bar; `(min-width:1024px)` → pinned doors, chat step-activation, sticky phone; `(hover:hover) and (pointer:fine)` → Lenis, paw cursor, paw trail.
Verified home behaviour by width (`raw/breakpoints-home.json`): 375/640 `data-pup=lane`, bar visible, nav hidden; 768 mascot live, bar hidden, nav hidden (Menu button), WA button visible; ≥1024 nav visible, doors pinned; doors track at 640→3 cols, 768→3 cols of 209px, 375→1 col 328px.

### 2.5 Buttons (`.btn`) — exact

Base: `min-height 3.25rem(52px); padding .85rem 1.6rem (13.6/25.6); font 1.0625rem/1.1 weight 650; radius 999px; gap .6rem; inline-flex center; transition: transform .35s var(--ease-pounce), background-color .25s ease, box-shadow .35s var(--ease-silk)`. `:active { transform: scale(.96) }`.
- **primary** `.btn-primary`: bg `#a24a1a`, text `#fffdf8`, `box-shadow: 0 .5rem 0 -.15rem #2a170e` (a solid cocoa "ledge" 8px below, −2.4px spread). Hover: shadow `0 .7rem 0 -.15rem`, `transform: translateY(-2px) rotate(-1deg)`.
- **whatsapp** `.btn-whatsapp`: bg `#1f7a4d`, text `#fff`, same shadow; hover `translateY(-2px) rotate(1deg)` (no shadow change).
- **ghost** `.btn-ghost`: transparent, `2px solid cocoa`, text cocoa; hover bg cocoa / text milk. (In dark scenes: border/text milk; hover bg milk / text cocoa.)
- Header WA button: `min-h 2.75rem !important; padding .6rem 1.35rem; font .95rem` (141x44), hidden <768.
- Sticky bar buttons: `!min-h-12 flex-1 !shadow-none`; ghost `!px-5`.
- `.link-ink`: toffee-ink text, underline 2px `toffee@55%`, offset .2em, hover underline = currentColor.
- `.chip`: honey-soft bg, radius 999, padding .3rem .8rem, 14px/600 (availability "Available" chip has a toffee paw icon 16px). Nav-anchor chips on how-it-works: `chip h-11 border-2 border-cocoa !bg-milk px-4 hover:!bg-honey-soft` with a plush toffee number.

Screens: `button-rest-1440.png`, `button-hover-1440.png`.

### 2.6 Surfaces / borders / shadows (the "ink" style)

Everything is drawn with **3px solid cocoa** outlines + **hard offset shadows** (no blur): 
- `.tp-board` (cards): `border 3px cocoa; bg milk; radius 1.6rem; padding clamp(1.1rem,2.6vw,1.75rem); box-shadow 6px 8px rgba(42,23,14,.14)`; inner dashed ring `::before inset 7px, 1.5px dashed rgba(42,23,14,.22), radius 1.2rem`.
- `.tp-paper` (passport/"what comes with" card): border 3px cocoa, radius 1.4rem, padding clamp(1.4rem,3vw,2.25rem), bg = two radial-gradient "scallop scale" patterns `rgba(194,98,43,.08/.06)` at 36x36 over `#fff8ea`.
- `.tp-letter` (detail enquiry panel): border 3px cocoa, milk, radius 1.6rem, padding clamp(1.5rem,4vw,2.75rem), shadow `8px 10px rgba(42,23,14,.16)`; corner **stamp** `4.75rem` square, `3px dashed toffee-deep`, honey-soft bg, rotate 6deg, top −1.25rem right 2rem, with a paw icon.
- `.tp-shopfront`: border 3px, radius 1.2rem, `linear-gradient(#fff1d8,#fbe3b4)`, top **awning** 1.9rem tall `repeating-linear-gradient(90deg, toffee 0 1.4rem, milk 1.4rem 2.8rem)` with bottom 3px border.
- `.tp-arch`: `border 3px cocoa; radius 999px 999px 1.6rem 1.6rem; bg honey-soft`.
- Photo masks: arch = `border-radius:999px 999px 0 0`.
- Chip/sticker shadow: `2px 3px rgba(42,23,14,.14–.2)`.
- Ticket: `filter: drop-shadow(5px 7px rgba(42,23,14,.16))`. Polaroid: `0 1px 1px rgba(42,23,14,.12), 0 10px 20px -8px rgba(42,23,14,.36)`.
- Tilts everywhere: `rotate: -3deg … 3deg` via CSS `rotate`/`--tilt` custom prop.

### 2.7 Easing / motion tokens

`--ease-pounce: cubic-bezier(.34,1.56,.64,1)` (overshoot/bounce — used for almost all hovers & pops) · `--ease-silk: cubic-bezier(.22,1,.36,1)` (smooth ease-out) · `--ease-snap: cubic-bezier(.7,0,.2,1)` (menu, hides) · Tailwind ease-in/out/in-out defaults. Default transition 150ms. All motion respects `prefers-reduced-motion` (curtain hidden, transitions .001ms, view-timeline animations off, doors forced open).

### 2.8 Scroll-reveal system (`data-reveal`)

Elements with `data-reveal`: if already in the viewport at mount (and curtain not covering) → `data-revealed` immediately; else `data-armed` and an `IntersectionObserver({rootMargin:"0px 0px -6% 0px", threshold:.08})` flips `data-revealed="true"` once. Reveals fired while the curtain is down are queued until the `tp:arrived` event. Default reveal (sketchbook/memories pages): `opacity 0→1` over .6s ease + `translate 0 1rem→0` over .7s silk. Component-specific reveals are in §5.

### 2.9 Route curtain (page transition) — behaviour & visuals

- DOM: `div.tp-curtain` (`position:fixed; inset:0; z-index:95; overflow:clip; visibility:hidden` unless state active) → `.tp-curtain__blanket` (grid center; bg = 2× `repeating-linear-gradient(±45deg, transparent 0 46px, rgba(42,23,14,.07) 46px 48px)` + `radial-gradient(circle at 50% 46%, milk 0, transparent 60%)` + `honey-soft`) with scalloped **top and bottom edges** (svg 40px tall, pattern 76x40: path `M0 40V27A38 25 0 0 1 76 27V40Z` fill honey-soft, stroke cocoa 3, + dashed arc `M11 33A27 19 0 0 1 65 33` stroke 1.6, dash 3.5/5.5, opacity .42; top edge at `top:-39px`, bottom edge flipped `scale:1 -1`).
- Stage `width:min(44rem,86vw); height:clamp(9rem,24vw,12rem)` centered: a **running puppy** SVG (`assets/svg/curtain-runner-01.svg`, 144x115 desktop, width `clamp(6.5rem,15vw,9rem)`) travelling `translate -40% → (stageW/1.5625)` in **1.15 s `cubic-bezier(.32,.1,.4,1)`**; legs swing ±23° `.32s ease-in-out alternate infinite`, body bob −6px `.16s`, tail wag −16…14° `.22s`, ear 0…8° `.16s`. 5 toffee paw prints (`left` 18/27/36/45/54 %, alternating `top` 6/−4/7/−3/6 px, rotations −76…−86+90deg) each `1s ease-out` pop (scale .4→1.08→1, opacity .7 then fade) with delays `.16s + .12s·i`. Caption "every puppy is family" in Shantell `clamp(1.05rem,2.4vw,1.45rem)` toffee-ink under the stage.
- States (`data-state`): `intro` (first load) — blanket starts covering, after .56 s lifts (`.48s cubic-bezier(.65,0,.3,1)` translateY(−100%−44px)), whole overlay hidden at 1.04 s; `covering` (link click) blanket slides up from below `.3s silk`; `covered` → router push; `lifting` `.46s cubic-bezier(.65,0,.3,1)`; back to `idle` after .46 s. Same-path clicks just scroll to top with a 120 ms lift. `html` scroll is locked during intro/covering (`tp-hold-still`). Ignored for: new-tab links, modifier clicks, `/admin|/api|/media|/_next`, same-page hash anchors (those smooth-scroll).
- Screens: `curtain-intro-*`, `curtain-nav-*`.

### 2.10 Cursor

Desktop (hover:hover & pointer:fine, no reduced motion): global custom **paw cursor** (`url(/cursor/paw.svg) 9 6`), links/buttons/summary/labels/tab/select use **`paw-press.svg`** (`assets/brand/paw-cursor.svg`, `paw-press-cursor.svg`: 32x32 cocoa paw with honey stroke, rotated −18°), text inputs `text`. Plus a **canvas paw-trail** (`canvas.fixed inset-0 z-[70] pointer-events-none`): every 46 px of pointer travel a toffee `#c2622b` paw print (scale .27 of the 64-box paw path, alternating ±7 px offset perpendicular to motion, +14/+16 px offset from pointer, rotation = heading) at α .42, solid 600 ms then fades over 400 ms; max 14 prints. Mouse only.

### 2.11 Smooth scroll

Lenis `lerp:.1, wheelMultiplier:.85`, only on `(hover:hover) and (pointer:fine)`; ignored inside `dialog, [data-lenis-prevent]`. Hash links smooth-scroll (`scroll-padding-top` = header-h+1rem).

---

## 3. SHARED COMPONENTS

### 3.1 Header (`header#site-header.tp-header fixed inset-x-0 top-0 z-50`)

- Bar: `max-width 110rem; height var(--header-h) (76 / 64); flex; align center; gap 1.5rem; padding-inline var(--gutter)`.
- Brand: `/brand/logo.png` (800x800 PNG) at **48px (≥768) / 41.6px (<768)** (`2.6rem→3rem`), hover `rotate -8deg .6s pounce`; wordmark "TeddyPups" Fraunces plush **22.4px/800** (`font-size: clamp(1.15rem,4.6vw,1.4rem)` below 1024; **hidden 1024–1279**, shown ≥1280 at 1.4rem). aria-label "TeddyPups U.A.E. — home".
- Nav (≥1024): `ul` gap `clamp(1.25rem,2.3vw,2.4rem)`, centered (flex:1). Links: Home, Puppies, Happy families, How it works, FAQ, Visit & contact (45–113px wide, 43px tall, padding `.55rem .1rem`). 16px/620. Active: toffee-deep text + a toffee **paw icon (.8rem, rot −10°)** under the label (bottom −.45rem). Hover: toffee-ink + paw fades to .45 opacity scale .4→1 (`.45s pounce`). Active is `pathname === href` or startsWith(`href/`); `/puppies/*` detail → "Puppies" active; `/` exact.
- Right: WhatsApp button (≥768) + **Menu** button (<1024): `h-10 rounded-full border-2 border-cocoa bg-milk px-4 text-[.95rem] font-semibold`, with a paw icon (size-4) + "Menu" (100x40). `aria-haspopup=dialog`.
- **Backgrounds/scroll states:** `::before` milk overlay + **hem** svg (`.tp-header__hem`, 14px scallop pattern 44x14: path `M0 0H44V2A22 11 0 0 1 0 2Z` fill milk + arc stroke `rgba(42,23,14,.14)` 1.5; `filter: drop-shadow(0 4px 4px rgba(42,23,14,.08))`, placed `top:100%-1px`). Both are `opacity 0→1 (.35s)` when `data-scrolled="true"` (scrollY>8) or whenever the page is not home (`:not([data-home])`). So: **home at top = transparent, no hem; scrolled = milk + hem; every other page = always milk + hem.**
- **Hide/show:** on scroll, `if |Δ|>6: data-hidden = (scrolling down && scrollY>220)`; `transform: translateY(-120%)` with `transition: transform .5s var(--ease-silk)`; any focus inside shows it again.
- Screens: `desktop-header-1440.png`, `desktop-header-scrolled-1440.png`, `header-hidden-…`, `header-shown-…`.

### 3.2 Mobile menu (`dialog.tp-menu`, <1024)

`<dialog>` `showModal()`, `m-0 h-dvh w-screen max-w-none bg-honey text-cocoa`, `::backdrop bg-cocoa/40`. Content `flex flex-col gutter pt-5 pb-[1.5rem+safe]`.
- Top row: "where to, friend?" (scrawl 18px) left; **Close** pill right (`h-11 rounded-full bg-cocoa px-5 font-semibold text-milk`, 86x44).
- Links (in `ul`): plush **`clamp(2.4rem,11vw,3.4rem)` (41.25px @375), weight 800, ls −1.03px, lh .92, `py-2` (54px rows)**, active = toffee-deep (`#a24a1a`). Items: Home, Puppies, Happy families, How it works, FAQ, Visit & contact.
- Bottom: full-width green WhatsApp button (343x52) + phone number text-center 14px/500 `+971 54 167 6733` (`tel:`).
- **Open animation:** `clip-path: circle(0% at calc(100% - 3rem) 2rem) → circle(150% …)` over **.5s `--ease-snap`**; links stagger in `translateY(1.2rem) rotate(-2deg) opacity0 → 0` **.55s pounce**, delay 0/50/100/150/200/250 ms. **Close:** reverse `.42s snap` (`data-closing`), backdrop fades; closes on Close, backdrop click, Esc, or route navigation (`tp:navigate`).
- Screens: `mobile-menu-opening-375.png`, `-open-`, `-closing-`.

### 3.3 Footer (`footer.tp-footer`, bg `#24130b`, text milk, `pb: bar-h + 2rem` mobile / `pb-10` ≥768)

- Top **hill**: svg `viewBox 0 0 1440 80` `preserveAspectRatio:none`, path `M0 80V44c120-30 240-44 360-30s240 46 360 34 240-58 360-46 240 40 360 26v52z`, fill `#24130b`, height `clamp(2.5rem,5vw,5rem)`, `position:absolute; bottom:calc(100% - 1px)`.
- Starfield (`absolute inset-x-0 top-6 h-64 overflow-hidden`): 9 four-point **sparkle** svgs (`viewBox 40 40`, path `M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z`, honey fill, 6–18 px, absolutely positioned %, `tp-twinkle` 3.2s ease-in-out infinite, opacity .35→1, scale .8→1.1, rotate 0→20°, staggered delays). **Moon** `.tp-moon`: 73px (`clamp(2.6rem,4vw,3.6rem)`) circle, `box-shadow: inset -.85rem .25rem 0 0 honey-soft` (crescent), `filter: drop-shadow(0 0 18px rgba(251,227,180,.35))`, `rotate -18deg`, `top 10% right 9%`.
- Grid: `gutter mx-auto max-w-[110rem] grid gap-12 md:grid-cols-12 md:gap-x-12 md:gap-y-6 pt-20 md:pt-28`.
  - Col 1 (`md:col-span-5`): "Home, at last." plush `text-big` honey-soft (60.48px) + paragraph `mt-5 max-w-md text-milk/80` "TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping."
  - Below it (`order-last md:order-none md:col-span-5 row-start-2`): **basket** `.tp-basket` (`--bw: clamp(14rem,24vw,19rem)`, aspect 300/240, `margin-left: calc(bw × −.36)` so it bleeds off the left edge) holding Teddy in `snug` pose, breathing (`tp-breathe 3.8s`, blink 6.2s, ear twitch 7.4s) — also the mascot's final stop; speech "hm?" on hover/click.
  - Nav (`md:col-span-3 md:col-start-7`): "Explore" (scrawl 18px honey) + list `space-y-2.5`: Available puppies `/puppies`, Gone home `/gone-home`, Happy families, How it works, Delivery & collection `/how-it-works#delivery`, FAQ, Visit & contact. Links `font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline`.
  - "Say hello" (`md:col-span-3`): WhatsApp `+971 54 167 6733` (`https://wa.me/971541676733?text=Hi%20TeddyPups!…`), `teddypupsadmin@gmail.com` (mailto), "Downtown Dubai, United Arab Emirates"; social pills `h-11 rounded-full border-2 border-milk/30 px-4 text-sm font-semibold hover:border-honey hover:text-honey`: Instagram `https://www.instagram.com/teddypups.worldwide/`, TikTok `https://www.tiktok.com/@teddypupsuae`, Facebook `https://www.facebook.com/profile.php?id=61567496944539`.
- Bottom bar: `mt-16 border-t border-milk/15 pt-6 text-sm text-milk/60 flex md:flex-row justify-between` → logo 36px + "© 2026 TeddyPups U.A.E." | "every puppy is family" (scrawl 16px honey/80).
- Mobile: single column; the stars/moon sit above "Home, at last."; basket under the social pills.

### 3.4 Sticky mobile bar (`[data-whatsapp-bar]`, <768 only)

`fixed inset-x-0 bottom-0 z-40 border-t-2 border-cocoa bg-milk px-3 pt-2.5 pb-[calc(.6rem+safe-area)]`; inner `mx-auto flex max-w-md gap-2`: green "WhatsApp us" (flex-1, min-h 48) + ghost "Call" (`tel:+971541676733`, px-5). Rendered height ≈ 71.5px (2 border + 10 + 49.9 + 9.6). Always visible on every page. Mascot "lane" mode sits just above it.

### 3.5 Skip link / misc

`a.sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-cocoa px-5 py-3 font-semibold text-milk` "Skip to content" → `#main`. `main#main.relative.pt-[var(--header-h)] outline-none`. JSON-LD (BreadcrumbList on detail, etc.).

### 3.6 Teddy mascot ("PupBuddy") — the system

- SVG `viewBox 0 0 300 240`, part groups with `data-p`: `root, shadow, body, bf/ff (back/front feet), tail, bn/fn (near feet), haunch, head, earL, earR, eyes, open, blink, happy, shut, tongue, mouth, ledge`. Palette: outline `#2a170e` (3.4px strokes, round joins), body `#f2be6b`, shade `#e4a352`, cream `#fbe3b4`, cheeks `#f9b9a6`, tongue `#e98c8c`, collar `#a24a1a`/`#6b2a1c`, white `#fff`. Snapshots: `assets/svg/mascot-teddy-*.svg` (poses vary per placement: hero=peek, meet=walk, fork/chat/passport/dusk/sketchbook=sit, house=bow, basket=snug, faq/contact=sit/sniff).
- Static placements (`.pup-stop` / `.pup-buddy`, `data-pose data-facing data-act`): hero (peek, behind quilt, act `peekaboo`), meet floor (walk, `treadmill`), signpost (sit), chat (sit), passport (sit), dusk (sit), night (sit, `tilt`), house (bow), footer basket (snug, `basket`), + per-page: sketchbook self-portrait (inside a hand-drawn circle with "self-portrait" caption), gone-home booth counter, how-it-works switch (sit), FAQ side (sit + "?"/"!" bubble), contact (sit, facing left, under the letter), puppy-detail tag card (peek over the card top edge, `w-[9.5rem] right-6 -top-[4.8rem]`), memories foot.
- **Live actor** (`.pup-layer fixed inset-0 z-30 pointer-events-none`, `.pup-actor` 300x240 translate3d, scaled per stop; layer goes `z-15` ("behind") when passing behind quilt / basket; `html[data-pup="live"|"lane"]` hides the static copy at the stop while the actor is there). Desktop track at 1440x900 (`raw/pup-actor.json`): hero (x≈395,y≈518, behind quilt, peek) → scroll 540-810 walks to the doors floor (x≈190,y≈671 — **stays there for the whole pinned doors section**, treadmilling) → 4320-5130 walks right to the signpost (x≈615,y≈630) → chat (x≈742,y≈620) → passport (x≈465-560,y≈520-580) → dusk (x≈780,y≈735 then left) → night (x≈44,y≈397) → house (x≈375,y≈620 bow) → footer basket (x≈−53, behind).
- **Mobile lane mode (<768):** only hero + basket stops are real; between them the pup peeks alternately from the left/right screen edge ~just above the sticky bar (`y≈649`, x −69 (left) or +197 (right)), scale `min(.62, max(.5, vw/650))` (≈.58 @375), flips each scene, hops across at scene boundaries.
- **Behaviours:** looks at hovered/focused links, buttons, inputs; reacts to chat steps (cues "ooh, photos!" at step 2, "home soon!" at step 3); click/tap on the pup picks one of `woof / jump / love / sneeze` (speech "woof!", floating toffee hearts `.pup-heart` 1.35rem); petting while hovered; random idle `tilt, peekaboo, hop, love, sneeze, woof`. Bubble: `.pup-bubble` Shantell 1.05rem, `2.5px cocoa` border, milk bg, radius `1.1rem 1.1rem 1.1rem .25rem`, shadow `2px 3px rgba(42,23,14,.18)`, `scale .4→1 .4s pounce`, shown ~1.4 s. Faint toffee paw prints (`.pup-prints`, 24 pooled svgs 15px) are stamped along its path.
- A faithful clone can ship a simpler version: fixed layer, CSS-transformed SVG, IntersectionObserver per stop, lerp toward each stop's target. The live site's feel = ~.12·viewport blend between stops.

### 3.7 Puppy card variants

1. **Hero lineup seat** (home) — arch photo, §5.1.
2. **Door** (home meet) — arched door that opens, §5.1.
3. **Sketch card** (`/puppies`, and the gone strip) — §5.3. Link `a.tp-sketch`, `aria-label "Max, Maltipoo, boy, 3 months, available"`.
4. **Ticket** (`/gone-home`) — §5.4.
5. **Polaroid** (happy families, home photowall) — §5.5.
Common data shown: `displayName`, breed, gender (boy/girl/"boy & girl"), age, status; `video` pill when the puppy has a video; `Available` sticker.

### 3.8 Badges / stickers

- **Available sticker** `.tp-sketch__sticker` / `.tp-door__tag`: Shantell 14.4px, `border 2px cocoa`, milk bg, radius 999, `padding .05rem .65–.7rem .15rem`, `rotate 7–8deg`, shadow `2px 3px rgba(42,23,14,.2)`; door tag position `top:16%; right:-.7rem`; sketch sticker `top:8%; right:-.2rem` (mobile `top:4%`, smaller).
- **Gone home sticker** (`--home`): toffee-deep border/text, Shantell 12.48px, `inset:auto auto -.4rem 50%; translate:-50%; rotate:-6deg`, text "gone home ♥".
- **Video pill** `.tp-sketch__video`: `bottom:9% left:9%`, milk text on `rgba(42,23,14,.82)`, radius 999, 11.8px/700, "▶ video".
- **Status chip** (detail): `.chip` honey-soft with paw icon + "Available". **Gone stamp** (detail): `inline-grid rounded-full border-[3px] border-current px-3 py-1 font-scrawl text-sm uppercase tracking-wide -rotate-6 text-toffee-deep` "Gone home ♥" (animates in on scroll: scale 1.25→.94→1, rotate −22°→−8°→−10°, `view()` timeline `entry 30% → cover 40%`).

### 3.9 Form inputs

- **Enquiry form** (detail page `EnquiryForm`): label `block text-[.95rem] font-semibold`; input `mt-1.5 h-12 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/.6)]`; textarea same with `py-3` (min ~124px); hints `mt-1 text-sm text-cocoa-soft`; "(optional)" in `font-normal text-cocoa-soft`. Fields (name/type/required/max): `name` text req 80 · `phone` tel req ph "+971 50 123 4567" (hint "With country code, e.g. +971 50 123 4567") · `email` optional · `area` optional, 80, ph "e.g. Dubai Marina" · `message` textarea 2000, prefilled "Hi! I'd love to know more about Copper (Cavapoo)." · hidden honeypot `website` (off-screen `-left-[9999px]`, autocomplete off) · submit `btn btn-primary w-full sm:w-auto disabled:opacity-70` "Send enquiry". Layout `grid gap-5 sm:grid-cols-2`.
- **Letter form** (`/contact`): §5.8.
- **Filter chips** (`.tp-sticker-chip`): `border 2px cocoa; bg milk; min-h 2.75rem; padding .45rem 1rem; font .95rem/650; radius 999; shadow 2px 3px rgba(42,23,14,.14)`; hover honey-soft bg, `translateY(-1px)`; active `translateY(1px)` shadow 0; `aria-pressed=true` = cocoa bg/milk text, `rotate -2deg`, shadow `1px 2px rgba(42,23,14,.25)`; transitions `.25s` colour + `.35s pounce` rotate/translate.
- **FAQ search**: `input[type=search]` `height 3.5rem; border 3px cocoa; radius 999; bg milk; padding 0 1.4rem 0 3.4rem; font 1.0625rem; shadow 0 6px 0 -2px rgba(42,23,14,.35)`; focus ring `0 0 0 5px rgba(242,190,107,.7)` + same ledge; magnifier svg 1.45rem at left 1.2rem (stroke 2.6px cocoa); placeholder `rgba(90,58,40,.65)` "delivery, Korea, vaccinated…".

### 3.10 Lightbox (`dialog` "Photo viewer", detail gallery + happy-families)

`m-0 h-dvh w-screen max-w-none bg-cocoa/95 text-milk`, `::backdrop cocoa/70`, `data-lenis-prevent`. Top bar `px-4 py-3`: counter text Shantell 18px ("Copper, photo 1 of 4" / "1 / 64") + **Close** (`h-11 rounded-full bg-milk px-5 font-semibold text-cocoa`). Image area `flex-1`, `object-contain`, sized to `min(vw, (vh−150)·aspect)`. Bottom: **Previous** (`h-12 rounded-full border-2 border-milk px-6`) / **Next** (`h-12 rounded-full bg-honey px-6 text-cocoa`). Keys ←/→; drag-x swipe (threshold 80 px, elastic .6); backdrop click closes. Slide animation (Motion): enter `x ±70, rotate ±5°, scale .92, opacity 0` → center spring `stiffness 300, damping 26`; exit `.22s` opposite. Neighbours preloaded. Screens: `puppy-lightbox-1440.png`, `happy-viewer-1440.png`.

---

## 4. PAGE-BY-PAGE (sections, measurements, decorations)

Shared page wrapper: `div.tp-page[data-page=…]` inside `main` (`pt: header-h`). Inner pages use `div.gutter.mx-auto.max-w-[110rem].pb-24.pt-10.md:pt-16`.

### 4.1 HOME `/` (title "TeddyPups U.A.E. — Premium teacup puppies in Dubai")

Heights @1440x900: hero 824 · meet 4126 · paths 1107 · chat 1697 · passport 922 · dusk 1545 · night 636 · cta 1021 · footer 701 (doc 12656). @375x812: hero 748 · meet 8822 · paths 1308 · chat 1581 · passport 1278 · dusk 1706 · night 954 · cta 1005 · footer 1303 (doc 18770).
Screens: `steps/home-1440/00…16`, `steps/home-375/00…27`.

#### A. Hero (`section.tp-scene.tp-hero`, `min-height: calc(100svh - header-h)`, flex column, `overflow-x:clip`)
- Background: sky `#fffdf8→#fff1d8`. **Sun glow** `.tp-hero__sun`: circle `width:min(86vw,58rem)` (928px), `radial-gradient(circle, honey@42% 0, honey-soft@30% 38%, transparent 66%)`, `top:4%; left:50%; translate:-50%`, `sunrise 2.6s silk`: opacity 0→1 and `translate -50% 16%→-50% 0`.
- Copy (`.tp-hero__copy.gutter`, centered, `padding-top: clamp(1rem,4.5vh,3.75rem)`):
  - Note "every puppy is family": Shantell `clamp(1.1rem,1.7vw,1.5rem)` (24px), toffee-ink, `inline-block relative`, with a hand-drawn **wavy underline svg** (`absolute -bottom-2 left-0 h-3 w-full text-toffee`, 254x12) — `assets/svg/hero-note-01.svg`.
  - H1 (plush, 2 block spans "Premium teacup" / "puppies in Dubai"), `max-width:15ch; margin: clamp(.5rem,1.6vh,1.1rem) auto 0`, `font-size: clamp(2.6rem, min(9.2vw, 11vh), 8.4rem)` → 99px/91px lh at 1440x900.
  - Lede 18px, `max-width:46ch`, margin-top `clamp(.9rem,2.2vh,1.4rem)`.
  - Actions `flex-wrap center gap .75rem; margin-top clamp(1.1rem,3vh,2rem)`: primary "View available puppies" (→/puppies, 232x52) + ghost "Enquire on WhatsApp" (230x52). Mobile: wrapped, stacked.
- **Stage** `.tp-hero__stage` (`flex:1; min-height clamp(14rem,38vh,25rem); margin-top clamp(.5rem,2vh,1.5rem); relative`; vars `--quilt-h: clamp(4.5rem,12vh,8rem)` (108), `--tw: clamp(15rem,min(30vw,46vh),27rem)` (414), `--rise: clamp(.75rem,2.4vh,1.75rem)`):
  - **6 arched photo "seats"** (`ul.tp-lineup`, `li.tp-lineup__seat` absolute): `left:var(--x); translate:-50%; rotate:var(--tilt); width: calc(var(--w) × seat-k)`, `bottom: calc(quilt-h − (1 − peek) × h0)`, `h0 = w × 1.25`. Desktop config `[x%, w(rem), peek, tilt°]`: `[9,8.6,.62,−5] [22.5,10.4,.8,3] [35,9.2,.7,−2] [65,9.4,.74,3] [77.5,10.6,.82,−3] [91,8.4,.6,4]`. (Tablet 640–1023: `--seat-k:.8`.) Photo frame: `border 3px cocoa; border-bottom:0; radius 999px 999px 0 0; bg honey-soft; box-shadow inset 0 0 0 4px milk; overflow hidden`; hover/focus: photo `translate 0 −12%` (.45s pounce). Images = puppy covers, `object-fit: cover` at the puppy's focal point. Entrance: each seat `tp-peek .75s pounce backwards` (translateY 100%→0) delayed `.62s + i·90ms`; hover transition delay `i·50ms`.
  - **Name tags** (`ul.tp-lineup--tags`, z 31): `.tp-lineup__name` Shantell 15.2px pill (`border 2px cocoa, milk, radius 999, padding .1rem .7rem`) above the photo, `opacity 0→1 .2s`, `translate … .35s pounce`; shown on hover/focus **and** by an auto-cycle: roughly every 1.7–2.8 s (`[1900,2500,1700,2300,2000,2800,1800]`) when the hero is ≥35% visible, tab visible, user not scrolling (1.2 s idle), a random seat **ducks** (photo `translate 0 108%, scale .92, opacity .6`, .34s snap), its image is **swapped for another of the 15 available puppies**, then **pops** back (`tp-pop-up .58s pounce`, scale 1.04 overshoot) and shows its name tag for 1.8 s. First/last seat tags are offset (`--tag-x −22% / −78%`).
  - **Teddy** peeks over the quilt center (pose `peek`, `width var(--tw)`, `left: calc(50% − tw×.7067)`, `bottom: calc(quilt-h + 30px − tw×.2733)`, behind the quilt, faces right). 
  - **Quilt**: `height var(--quilt-h)`, z 25, `inset auto 0 0`; bg = 2× `repeating-linear-gradient(±45deg, transparent 0 46px, rgba(42,23,14,.07) 46px 48px)` on `var(--quilt)` (`#fff1d8`) — a **diamond lattice**; top edge `svg.tp-quilt__edge` (40px, `top:-39px`) with the **scalloped** hem pattern (76x40 scallops, cocoa 3px stroke, dashed inner stitch). 
- **Mobile (<640):** seats re-spaced `x: 8/21/33.5/66.5/79/92 %`, `--w: 17vw`, `--peek: 1.18/1.3/1.12/1.12/1.3/1.18`, z-index 1/2/3/3/2/1, name tag 13.12px max-w 46vw ellipsis, `--tw: clamp(13rem,60vw,17rem)`, `min-height clamp(14rem,36vh,19rem)`. Teddy is smaller and centered in front of the middle gap. h1 41.6px, lede 16.8px.
- Screens: `desktop-home-viewport-1440.png`, `mobile-home-viewport-375.png`, `home-viewport-*`.

#### B. Meet the pups (`section.tp-scene.tp-meet`)
- Head (`header.tp-meet__head.gutter`, `flex-wrap justify-between items-end gap 1.25rem 2rem; max-w 110rem`): left `h2.text-huge` "Meet the pups" + lede "Real puppies, real photos, looking for their families right now." (`max-w-[44ch]`, mt-3); right primary button "See all available puppies" (→/puppies).
- **≥1024: pinned horizontal scroll.** `section[data-pinned]` height = `100vh + (trackW − vw)/1.25` (4126 @1440x900; 3194 @1024x768; 3667 @1280x800; 4933 @1920x1080); inner `.tp-meet__stage` `position:sticky; top:0; height:100vh; padding-top: header-h + clamp(1rem,3vh,2.5rem); flex column; overflow hidden`. `.tp-meet__hall` flex:1; `.tp-meet__track` (`ol`, absolute `left:0; bottom:var(--floor-h)`, `display:flex; align-items:flex-end; gap: clamp(4.5rem,6vw,7rem); width:max-content; padding-inline: 38vw 12vw`; at 1440 it is 5472px wide) is moved with **`transform: translateX(−progress·(trackW−vw))`** (measured ratio 1.24 px per scroll px; lightly eased/lagged ≈.1 lerp). Floor `.tp-meet__floor` (`height var(--floor-h)=clamp(5rem,13vh,8rem)`; top border 3px cocoa; bg: `linear-gradient(to bottom, rgba(42,23,14,.16), transparent 22%)` + vertical plank lines every 11rem (`rgba(42,23,14,.12)`, scrolls with `--floor-x`) over `linear-gradient(#e8b06a,#dc9a52)`; `box-shadow 0 −12px 0 −6px #f5d9a8`).
- **Door** (`li.tp-door`, width `--door-w: clamp(8rem, min(15vw,24vh), 16rem)` = 216px @1440x900): plate above (name plush `clamp(1.45rem,2vw,2rem)` lh 1 centered, line-clamp 3; meta 14.4px/600 cocoa-soft, clamp 2), then `.tp-door__frame` (`aspect-ratio 4/5.2; border 3px cocoa; border-bottom 0; radius 999px 999px 0 0; bg #3b2215`) → `.tp-door__way` (perspective 700px, origin left, overflow hidden) containing the **room** (puppy cover `img`, scale 1.04 when open) and the **door leaf** (`border 3px cocoa; radius arch; bg = repeating 4-plank lines rgba(42,23,14,.18) over var(--door)`; inner panel outline `inset 12% 14% 9%`, `2.5px rgba(255,253,248,.28)`, paw "peephole" icon at 19% top; **knob** .85rem honey circle at top 56% right 11%; `transform-origin:left; transition transform 1.05s cubic-bezier(.3,1.32,.48,1) .05s`; open = `rotateY(78deg)`). "Available" tag at right. Hover/focus also opens the door + name goes toffee-deep. **Open state in pinned mode** is JS (`data-open`): a door opens when its centre has passed ≈45% of the viewport width (leftmost doors open first; at scroll start only door 0 is open); not in pinned mode it uses `animation-timeline:view()`, `animation-range: entry 55% → cover 48%`, `tp-door-open` (rotateY 0→78°).
- Last item `li.tp-door--all`: dashed arch (`border 3px dashed cocoa; transparent`) with plush `clamp(1.6rem,2.4vw,2.4rem)` underlined (toffee, 8% thickness, offset .18em) "Meet them all" → /puppies.
- Under non-pinned frames a small shelf `::after` (`.6rem` tall, `#dc9a52`, 3px border, −.55rem overhang). Teddy walks on the floor at `left:14vw; bottom: floor-h×.42; width clamp(11rem,min(14vw,24vh),14rem)`.
- **<1024 (non-pinned):** `.tp-meet__track` = `display:grid; grid-template-columns: repeat(auto-fill, minmax(min(10.5rem,42vw),1fr)); gap 2.75rem 1.25rem (≥640: 3.5rem 2rem); padding-inline gutter`. Measured: 375 → 1 column 328px wide doors (≈491px tall incl. name), 640 → 3 cols of 170px, 768 → 3 cols of 209px. Teddy sits top-right above the head (`right: gutter; width clamp(8rem,26vw,11rem); top clamp(-9.5rem,-20vw,-6rem)`); on <768 it is the lane-mode peek. Door leaf opens on scroll via the `view()` timeline.
- Screens: `steps/home-1440/01–06`, `steps/home-375/01–05`.

#### C. Two ways to meet your puppy (`section.tp-scene.tp-paths`, padding-block `clamp(4.5rem,11vh,8rem) clamp(3rem,8vh,6rem)`)
- `h2.tp-paths__title.text-huge` centered `max-w-[13ch]`.
- `.tp-fork` `grid gap 2.5rem; margin-top clamp(2.5rem,6vh,4.5rem)`; ≥1024: `grid-cols 1fr 1fr; column-gap clamp(9rem,16vw,15rem); padding-bottom 8.5rem`, with a **wooden signpost** `.tp-fork__post` (1.5rem wide, `border 3px cocoa; radius .6rem .6rem .2rem .2rem`, vertical plank lines over `linear-gradient(90deg,#d38f45,#b8742f)`, `top:-2.2rem; bottom:2.6rem`, centered) and two **arrow signs** `.tp-sign` (h 4.2rem; `border 3px cocoa`; wood `linear-gradient(#e4a85b,#d38f45)` + horizontal grain `repeating-linear-gradient(0deg, transparent 0 9px, rgba(42,23,14,.09) 9px 10px)`; plush `clamp(1.5rem,2.4vw,2.35rem)`; arrow tip = rotated 45° square pseudo-element 2.95rem; `box-shadow 0 7px 0 −3px rgba(42,23,14,.25)`; left sign rotate −2deg pointing left, right sign rotate 1.5deg pointing right) labelled **"Puppies in Dubai"** / **"Imported for you"**. Teddy sits at the foot of the post (`width clamp(11rem,13vw,13.5rem); translate −46%`).
- Left way (`article.tp-way--left`, right-aligned text): scene `.tp-way__scene` (h `clamp(13rem,22vw,19rem)`): a faint **Dubai skyline** line-art (`tp-way__skyline`, color ink@30%) + a **shop window** `figure.tp-window` (width `clamp(8.5rem,13vw,12rem)`, left 32%): striped awning (`repeating-linear-gradient(90deg, toffee 0 1.05rem, milk 1.05rem 2.1rem)`, radius .5rem, 3px border) over a glass panel (`aspect 4/4.6; border 3px; inset 5px milk ring; honey-soft`) containing a puppy photo (the Max-ish apricot teddy puppy, `A tiny apricot teddy bear puppy…` image) + caption "In our showroom" (scrawl 15.2px). Text "See them, love them, take them home. Come meet our locally available puppies before you decide." (max-w 40ch, cocoa-soft) + primary button "Meet local puppies" → `/puppies?origin=local`.
- Right way: scene = **flight path** (`.tp-flight`, svg dotted toffee-deep route `stroke-dasharray 3 11`, round dots at "Korea" and "Dubai" with Shantell 19px labels, white **airplane** with toffee wings and a porthole containing a tiny puppy photo, drawn with cocoa 4px outlines) — plane `tp-plane-bob`. Text "Exclusive Korean teacup puppies, delivered. Order from the world's most reputable breeders and let us handle the import." + primary "See imported puppies" → `/puppies?origin=imported`.
- Mobile: stacked (left way, Teddy centered `width clamp(9rem,40vw,12rem)`, right way), signs left/right aligned with arrow tips, no post.

#### D. Your puppy journey (`section.tp-scene.tp-chat`, padding-block `clamp(4.5rem,10vh,7rem) clamp(4rem,9vh,6rem)`)
- `.tp-chat__grid.gutter` max-w 110rem, `gap 3.5rem`; ≥1024: `grid-cols minmax(0,1fr) minmax(0,30rem); column-gap clamp(3rem,8vw,9rem)`.
- Left: `h2.text-huge` "Your puppy journey" + lede "A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful." (max-w 42ch) + 3 steps (`ol.tp-chat__steps`): each `grid 3.4rem 1fr; column-gap 1.1rem`: number disc (3.4rem/54px, `3px cocoa`, milk, plush 28px) + plush title `clamp(1.6rem,2.3vw,2.3rem)` + text (max-w 40ch cocoa-soft). Steps: **1 Choose your breed** — "Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle." · **2 Get photos & details** — "Our team will share real photos, health details, and all necessary information directly on WhatsApp." · **3 Secure & safe delivery** — "Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free." Then ghost button "How it works" (→/how-it-works).
  - ≥1024: each step `min-height 44vh` (last 40vh) with `opacity .4` until active/done (`transition opacity .5s`); IntersectionObserver `rootMargin "-28% 0px -62% 0px"` activates the step crossing that band; active number disc → toffee-deep bg, milk text, `scale 1.1` (`.4s` colour, `.5s pounce`). <1024: all visible, last state shown (`R = last`).
- Right: `.tp-chat__side` (`position:sticky; top: header-h + 5vh`) holding a **phone** `.tp-phone` (`width min(100%,23rem)`; `border 3px cocoa; bg cocoa; radius 2.7rem; padding .55rem; rotate 1.5deg; shadow 12px 16px rgba(42,23,14,.16)`): bar (milk, radius `2.1rem 2.1rem .5rem .5rem`, avatar logo 2.5rem + "TeddyPups U.A.E." 15.7px/700 + "online" 12.5px), **screen** (`bg: tiled toffee paw pattern (46px, fill .09) on #fbecd2; radius .5rem; height clamp(23rem,54vh,32rem); flex column justify-end gap .5rem; overflow hidden`), then compose bar "Say hello on WhatsApp" with a green circular send icon (`a` → WhatsApp). Messages `.tp-msg` (`border 2px cocoa; radius 1.05rem; padding .5rem .75rem; font .88rem/1.38; max-width 86%`): "me" = honey bg, bottom-right radius .25rem, right-aligned ("Hi TeddyPups! I'd love to know more about your puppies."); "them" = milk, bottom-left .25rem, with chips (`tp-chips a`: honey-soft, 1.5px border, radius 999, .8rem/650) for breeds Maltipoo/Pomeranian/Poodle/Cavapoo/Shih Tzu (→ `/puppies?breed=…`); step 1 reply = 2×2 photo grid (`.tp-snaps`, 11.5rem, radius .65rem) + a **video clip bubble** (`.tp-clip` 9rem, 4/5, radius .8rem, autoplay-on-tap play button 2.9rem circle) + text; step 2 reply = a route sketch (dotted toffee line to a honey **house** icon with paw prints) "Once confirmed, we handle everything…". Messages appear per active step (`.tp-msg-group[data-show]`, `tp-msg-in .5s pounce`: opacity 0, translateY .8rem, scale .92; stagger .18s) with a typing indicator (3 bouncing dots `tp-dot .9s`) for .75 s before each reply. Teddy sits beside the phone (`width 11rem; bottom −1.6rem; left −8.5rem`).
- Mobile: the phone is shown last in static "all steps done" state, not sticky; Teddy hidden (lane).
- Screens: `steps/home-1440/07–10`, `steps/home-375/…`.

#### E. Why families trust TeddyPups — the **passport book** (`section.tp-scene.tp-passport`, padding-top `clamp(4rem,9vh,6.5rem)`)
- `.gutter mx-auto max-w-[96rem]` → `.tp-book` (`max-width 72rem; margin 0 .6rem clamp(3.5rem,8vh,6rem)`; `rotate −.35deg` (−1.2deg ≥900); `filter: drop-shadow(10px 14px rgba(42,23,14,.18))`; behind it a toffee-deep cover `::before inset −.85rem −.95rem; border 3px cocoa; radius 1.7rem` with soft white radial highlight).
- ≥900: two pages `grid 1fr 1.3fr` (left page radius `1.1rem 0 0 1.1rem`, inner spine shadow `inset −26px 0 30px −24px rgba(42,23,14,.35)`; right page `radius 0 1.1rem 1.1rem 0`, `inset 26px 0 30px −24px rgba(42,23,14,.3)`); <900 stacked top/bottom. Page bg = paper scallops over `#fff8ea`, `border 3px cocoa`, padding `clamp(1.6rem,4vw,3.2rem)`.
- Left: kicker "puppy passport" (scrawl 18.4px toffee-ink), `h2.tp-book__title` "Why families trust TeddyPups" (plush `clamp(2.2rem,4.2vw,3.9rem)`, `max-w 12ch`), Teddy sitting on the page's bottom-right (`width clamp(10rem,13vw,12.5rem); bottom .5rem; right −1.5rem`, overlapping the spine).
- Right: 2×2 `.tp-entry` (`flex column center`): a **rubber stamp** `.tp-stamp` (`aspect 1; width clamp(8.5rem,12vw,10.5rem)`, `border 3px` in `--ink-stamp`, `mix-blend-mode multiply; opacity .9; rotate var(--tilt)`; **grunge mask** = inline SVG feTurbulence noise mask; inner dashed ring `1.5px dashed` inset 5px; icon 2.5rem + plush 17.28px title) + caption (14.72px, cocoa-soft, max-w 26ch). Shapes: round, ticket (aspect 1.3, radius .7rem), oval (1.35), scallop (dotted 5px border, round). Stamps: **Vet-checked & healthy** (heart-pulse icon, `#a24a1a`, −8°, round) "Every puppy comes vaccinated, dewormed, and with a verified health certificate." · **Korea to Dubai, safely** (plane icon, `#1f6b45`, 5°, ticket) "Trusted breeders, safe travel, and premium care from start to finish." · **Support 24/7** (chat icon, `#5a3a28`, −4°, oval) "Always here to help, from choosing your puppy to post-delivery support." · **Trusted by families worldwide** (globe icon, `#c2622b`, 7°, scallop) "Puppies delivered to loving homes all around the world." Stamp reveal: `tp-stamp-in` — scale 1.7→.93→1.03→1, opacity 0→.95→.9, rotate `tilt−16°→tilt`, `view()` timeline `entry calc(55% + i·9%) → cover calc(42% + i·6%)`.
- **Horizon** `.tp-horizon` below (height `clamp(5rem,12vw,10rem)`; a city silhouette svg `viewBox 0 0 1440 160` filled with the next sky colour + a **setting sun** (`radial-gradient(closest-side, #ffd27f 0 70%, rgba(255,210,127,.45) 73%, transparent)`, size `clamp(7rem,16vw,13rem)`, `left 62%; bottom 18%`) that slides `translate 0 −60%→40%` over the section exit (`view()`, range `entry exit 30%`).
- Mobile: pages stacked, left page bottom padding for Teddy; stamps 1 column (earlier shot: `m_home_03/04`).

#### F. Happy families & puppies — dusk (`section.tp-scene.tp-dusk`, padding-top `clamp(3rem,7vh,5rem)`, light-on-dark)
- `.tp-dusk__sky.gutter` grid; ≥1024 `grid-cols minmax(0,1fr) minmax(0,31rem); align-items end`: `h2.text-huge` "Happy families & puppies" (milk) + lede (max-w 50ch, milk/80) "We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts."; right: **speech-bubble note** `figure.tp-dusk__note` (`border 3px cocoa; milk; radius 1.8rem 1.8rem 1.8rem .35rem; padding 1.3rem 1.5rem 1.2rem; rotate 1.2deg; shadow 7px 9px rgba(20,10,5,.25)`; ≥1024 a rotated-square tail at bottom-left): blockquote Fraunces `font-plush-text` `clamp(1.02rem,1.25vw,1.2rem)`/1.5 “TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.” + figcaption (scrawl, toffee-ink) "Sarah M., Dubai, UAE".
- **Photo wall** `.tp-photowall` (margin-top `clamp(3rem,7vh,4.5rem)`): wooden wall `border 3px cocoa; bottom 0; radius 1rem 1rem 0 0; margin-inline clamp(.75rem,3vw,3rem); max-width 104rem; padding clamp(2.2rem,4vw,3.2rem) clamp(1rem,3vw,2.75rem) 0; bg: lamp radial glow (55%×45% at 12% 100%, rgba(255,205,110,.28)) + horizontal board lines every 48px (rgba(42,23,14,.12)) over `linear-gradient(#80482a,#6c3b22)`; top **beam/shelf** `::before` (inset −1.15rem −.9rem auto; height 1.7rem; border 3px; `#5a301b`, hatched underside`). Prints grid: 2 cols (<640, shows first 6) / 3 cols (≥640, 6) / **4 cols (≥1024, shows 8)**; `gap 2rem 1.1rem` (≥640 `2.4rem 1.6rem`; ≥1024 `2.6rem clamp(1.4rem,2.6vw,2.8rem)`); items 2 & 3 of each 4 offset `margin-top 1.4rem`. Each `button.tp-photowall__print` → **polaroid** (§5.5) with photo `aspect 4/4.6` + caption; tape pieces; opens the lightbox (shared with /happy-families, 64 photos). Reveal: polaroid `opacity 0, translateY −2.6rem, rotate tilt+9°` → settles with pounce (`.75s`, delay `--d`), tape scales in .35s at `d+.52s`.
- **Facade ground** `.tp-facade__ground` (`min-h clamp(10rem,18vw,13rem); flex center; margin-top 2.6rem`): front door (`width clamp(5.5rem,8vw,7.5rem); height clamp(8.5rem,12vw,11rem); arch top; two-leaf split line; bg toffee-deep; rings 6px #b2733f + 9px cocoa`), **street lamp** `.tp-lamp` (pole .7rem wide, h `clamp(9rem,14vw,12.5rem)`, left 9%; lamp head 2.4×2.1rem `#ffd27f`, glow `0 0 44px 20px rgba(255,205,110,.45)`), the CTA "See every happy family" (primary → /happy-families, `absolute bottom 1.6rem right clamp(.5rem,5vw,5rem)`; <640 static above, column), Teddy sitting beside the door (`left calc(50% + clamp(3.5rem,6vw,5.5rem))`, mobile `right 4%`). Below: **pavement** `.tp-street__pavement` (h `clamp(1.6rem,3vw,2.4rem)`, top 3px cocoa, tiles every 6rem `rgba(255,255,255,.07)` over `#3a2114`).

#### G. Questions, answered — night (`section.tp-scene.tp-night`, padding-block `clamp(4.5rem,10vh,7rem)`, `overflow:hidden`)
- Stars: 11 twinkling honey sparkles (`tp-twinkle`) absolutely positioned over the section (`.tp-night__stars`).
- `.tp-night__grid.gutter` `gap 3rem`; ≥1024 `grid-cols 5fr 7fr; column-gap clamp(3rem,7vw,8rem)`. Left: `h2.text-huge` "Questions, answered" (milk), ghost button "Read all questions" (→/faq), Teddy `tilt`-sitting (`width clamp(9.5rem,30vw,13rem)`, hidden <768) with a floating honey "?" (`tp-float 3.4s`, plush `clamp(2.4rem,4vw,3.4rem)`, top −2.4rem left 58%).
- Right: `dl.tp-night__list` `gap clamp(2rem,4.5vh,3.25rem)`: first **3 FAQ** items (`.tp-qa`): `dt` = honey four-point **star** icon (1.15rem, `margin-top .3rem`) + plush `clamp(1.4rem,2vw,1.95rem)`/1.12 milk; `dd` `max-w 58ch; margin-top .7rem; padding-left 1.9rem; ink-soft`. Texts = FAQ 1–3 (§FAQ content).

#### H. CTA — "Ready to meet your new best friend?" (`section.tp-scene.tp-home`, centered, padding-top `clamp(4.5rem,10vh,7rem)`)
- `h2.text-huge` (`max-w 15ch`, milk) + lede (`max-w 52ch; margin 1.2rem auto 0; clamp(1.05rem,1.3vw,1.3rem)/1.55; milk/80`) "Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe delivery across the UAE."
- **House scene** `.tp-house` (`width min(100%,44rem); height clamp(21rem,46vh,29rem); margin clamp(2.5rem,6vh,4rem) auto 0`): wall `::before` (`inset 0 6% 2.2rem; border 3px; radius 1.4rem 1.4rem 0 0; bg horizontal plank lines over linear-gradient(#5c3622,#4a2a19)`), ground slab `::after` (`#3a2114`, h 2.4rem), **doorway** (`aspect 1/1.62; width clamp(8.5rem,15vw,11.5rem)`; arch; rings 7px #b2733f + 10px cocoa + warm glow `0 0 60px 18px rgba(255,205,120,.35)`; inside = radial `#ffe4a8→#e9a95a` showing a puppy photo ("Max, waiting inside")), **door** (`rotateY(0 → −102deg)` from the left hinge; `view()` timeline `entry 80% → cover 52%`; when the mascot is live: `transition transform 1.2s cubic-bezier(.3,1.25,.5,1) .3s`, opens once visited), peephole (34% circle `#ffd98f`), knob, wall **lamp** (1.9×2.6rem `#ffd27f`, glow `0 0 46px 22px rgba(255,205,110,.4)`), two **potted plants** (3.4–4.6rem; 3 overlapping green ellipses `#5f8f4a #6fa356 #7bb060`, toffee pot, left one hidden <640), doormat "welcome home" (scrawl 15.2px; stripes honey/`#e7a957` 1.2rem, 3px border, `width clamp(10rem,16vw,13rem)`), Teddy bowing at left (`left calc(50% − clamp(15rem,24vw,19rem))`, mobile `left 0; width 7.25rem`).
- Actions `.tp-home__actions` center, `padding-block clamp(2rem,4vh,2.75rem) clamp(5rem,11vh,8rem)`: green "Enquire on WhatsApp" + ghost "Visit & contact" (→/contact).

#### I. Footer — §3.3.

### 4.2 PUPPIES `/puppies` ("Available puppies — sketchbook")

`section.tp-sketchbook` bg: dot grid `radial-gradient(circle at 1px 1px, rgba(42,23,14,.09) 1px, transparent 1.6px) 0 0/26px 26px` over `linear-gradient(180deg,#fff8ec, milk 60%)`. Screens: `steps/puppies-1440/00–04`, `steps/puppies-375/…`, filters `puppies-filter-*`.
- Head `.tp-sketchbook__head` grid `minmax(0,1fr) auto` (≥768; gap 2rem 3rem; `items-end`): kicker "from Teddy's sketchbook" (scrawl 18px toffee-ink) · **h1 "Available puppies"** (plush `text-giant` 135.36px @1440 / ≈50px @375; inline-block; padding-bottom .18em) with a **hand-drawn toffee underline** (svg path `stroke toffee 7px round`, height .24em, bottom −.05em; **draws on** via `stroke-dashoffset 1→0 .9s silk, delay .25s` when revealed) · lede "Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp." (max-w 46ch) · right: **self-portrait** circle (`width clamp(9rem,26vw,13rem)`; `aspect 1; border 3px cocoa; bg mix(honey-soft 70%, milk)`; wobbly radius `52% 48% 50% 50% / 50% 52% 48% 50%`; a second thin `2px rgba(42,23,14,.45)` ring offset & rotated −6° via `::after`; Teddy inside; caption "self-portrait" scrawl 17px below). Mobile: 2-col mini grid (text left, self-portrait right at `clamp(7.5rem,34vw,9.5rem)`).
- **Filter pad** `.tp-sketchpad` (`border 3px cocoa; milk; radius 1.2rem 1.6rem 1.3rem 1.5rem; padding clamp(1.1rem,2.6vw,1.6rem) clamp(1.1rem,2.6vw,1.75rem); rotate −.35deg; shadow 5px 7px rgba(42,23,14,.12)`; a piece of **masking tape** on top-left `::before` (5.5×1.5rem, `honey@55% + white`, rotate −4°, α.85)). Three rows (`flex flex-wrap gap-2`, row label `span.font-scrawl w-full sm:w-28` cocoa-soft): **where** [Everywhere, Imported, Korean Teacup] · **breed** [Maltipoo, Pomeranian, Poodle, Cavapoo, Shih Tzu] · **boy or girl** [Boys, Girls]. Behaviour: single-select per row, "Everywhere" = clear where; client-side filter; URL query `origin=imported` (Imported) / `collection=korean-teacup` (Korean Teacup, replaces origin) / `breed=<slug>` (`maltipoo, pomeranian, poodle, cavapoo, shih-tzu`) / `gender=male|female`; param order = click order; "Clear filters" toffee link appears bottom-right when any active. Count line (scrawl 18px, `mt-10`): "15 puppies looking for a home" → with filters "6 puppies match" / "1 puppy match" / "0 puppies match". Empty state: a tape-topped card with Teddy and plush "No puppies match just now." + text "Tell us what you're hoping for and we'll let you know what's in our…" (see `puppies-filter-empty-1440.png`).
- **Sketch grid** `ul.tp-sketches` (`mt-8`): `grid-template-columns: repeat(auto-fill, minmax(min(14.5rem,40vw),1fr)); gap 3.25rem clamp(1.1rem,3vw,2.5rem); padding-inline .4rem`; ≥640 every even `li` `translate 0 2.4rem` (zig-zag) + `padding-bottom 2.4rem`. Measured: 1440 → **4 cols of 295px** (15 cards → rows of 4/4/4/3); 375 → 1 col; `sizes`: `(min-width:1536px) 17rem, (min-width:1024px) 22vw, (min-width:640px) 30vw, 46vw`.
- **Sketch card** `a.tp-sketch` (text-align center, `--tilt` −2…2.5deg, `--d` = i%8·70ms, `--wash` cycling): 
  - `.tp-sketch__frame` (`aspect 1; rotate var(--tilt); hover rotate −tilt .6s pounce; active scale .96`) containing: (1) **wash blob** svg (organic 100×100 path filled `--wash`, `opacity .55`, slightly offset `translate ±4%`), (2) **photo** `.tp-sketch__photo` (`inset 4.5%`) clipped by an **organic blob mask** (per-puppy generated 100-point smooth path as data-URI `mask-image`), `object-fit cover` at the puppy's `focalX/focalY` (`object-position`), image `scale 1.06` on hover (.45s silk), (3) **ink** svg: a wobbly outline path (`stroke cocoa 1.9px, round, vector-effect non-scaling-stroke, pathLength 1`) + a lighter **retrace** (1.2px, α .55, +.26s delay) offset from the photo like a pen sketch, and 1–2 **doodles** (random from: toffee paw, cocoa heart outline, toffee 4-point sparkle, spiral/swirl, 3 dashes "motion lines", 2–3 dots; fills `#2a170e/#c2622b/#d4893f/#a24a1a`, scale .85–1.2, rotate ±10°), (4) "Available" sticker, (5) "▶ video" pill if the puppy has video.
  - Under the frame: name (plush `clamp(1.35rem,2vw,1.85rem)`/1.02, mt 1rem) and meta (14.4px/600 cocoa-soft) "Maltipoo · boy · 3 months" (breed omitted if same as name → "girl · 2 months").
  - **Reveal** (`data-armed` → `data-revealed`): lines draw (`stroke-dashoffset 1→0` `1s silk`, delay `--d`; retrace +.26s), photo mask **iris-opens** `clip-path: circle(0% at 50% 55%) → circle(75%)` `.85s silk` delay `d+.12s`, wash fades/scales (`opacity 0→.55, scale .85→1`, .6/.8s), doodles + sticker `scale 0→1` `.5s pounce` at `d+.52s/.64s`.
  - **Hover/focus:** frame counter-rotates, ink lines turn toffee-deep, doodle hops (`tp-doodle-hop .5s pounce`: rotate 12°, scale 1.35), name → toffee-deep; focus-visible thick 3px lines.
- **Gone strip** `section.tp-gone-strip` (bg: dot grid on honey-soft; padding-block `clamp(4rem,9vh,6rem)`; wavy dark hill into the footer): left (`md:w-1/3`) h2 "Already gone home" (plush `text-big`) + "These puppies have found their families." + primary "See the puppies who've gone home" (→/gone-home); right 5 small sketch cards (`.tp-gone-strip__row` `grid repeat(auto-fill,minmax(7.5rem,1fr)); gap 2rem 1.5rem`; photos `saturate(.75) sepia(.12)`; name plush 1.15rem/18.4px; "gone home ♥" sticker) — Ace, Leo, Mia, Sadie, Pomeranian (`blue-marle-pomeranian`).

### 4.3 PUPPY DETAIL `/puppies/[slug]` (title "Copper, Cavapoo puppy | TeddyPups U.A.E."; meta "Meet Copper: Cavapoo, boy, 2 months old, imported. Real photos from TeddyPups U.A.E."; og:image = cover)

`article.tp-storybook` (relative; bg `linear-gradient(#f8f3ea, #fffdf8 85%)` — a faint warm-to-milk wash). **Bookmark ribbon** `.tp-ribbon` (≥1024 only; `absolute top 0 bottom 0; left max(.3rem, gutter×.5 − .6rem); width 1.2rem`; inner `.tp-ribbon__track` sticky `top: header-h + 1.4rem; height calc(100vh − header-h − 4.4rem)` with a gradient toffee band `linear-gradient(90deg,#8e3f15,#c2622b 45%,#a24a1a)` that **grows with scroll progress** (`transform-origin 50% 0`, `scaleY` measured .10 at scrollY 0 → .42 @600 → .75 @1200 → 1 @2000, i.e. ≈ reading progress of the article) and a V-notch bottom `clip-path polygon(0 0,100% 0,100% 100%,50% calc(100% − .75rem),0 100%)`; top cap radius .6rem).
Container: `gutter mx-auto max-w-[110rem] pb-20 pt-8 md:pt-12`.
1. Breadcrumb `Available puppies / Copper` (gone puppies: `Gone home / Ace`) `text-[.95rem] font-semibold text-cocoa-soft`, link = `.link-ink`.
2. **Chapter 1** `.tp-chapter` (flex gap .7rem; scrawl 18.4px toffee-ink): numbered blob `.tp-chapter__n` (2.3rem; `border 2.5px; radius 52% 46% 50% 48%; rotate −6deg; plush 1.15rem`) + "hello, it's me" (gone: "the day they went home").
3. Grid `mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14`:
   - **Gallery** (`lg:col-span-7`): `.tp-storypage` (`aspect-[4/5] md:aspect-[5/6]; border 3px cocoa; radius 1.2rem; overflow hidden; bg honey-soft`; double **stacked-page shadow** `7px 7px 0 −2px milk, 7px 7px 0 1px cocoa, 14px 14px 0 −2px milk, 14px 14px 0 1px cocoa`) with a full-bleed `button` (opens lightbox) showing the image `object-cover`; bottom overlay `absolute inset-x-4 bottom-4 flex justify-between`: prev `‹` (`size-12 rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold`), counter pill "1 / 4" (`rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk`), next `›`. Image changes with Motion slide (enter `x ±70/rotate ±5/scale .92`, spring 300/26). Video items autoplay muted loop `playsInline` (`object-cover size-full`, poster). **Thumbnails** `ul.mt-3 flex gap-3 overflow-x-auto px-1 pb-2 pt-2`: `button relative block h-24 w-20 md:h-28 md:w-24 rounded-[.9rem] border-[3px] overflow-hidden transition-transform .3s`; selected = `-rotate-3 -translate-y-1 border-toffee-deep`, others `border-cocoa/30 hover:-rotate-2 hover:border-cocoa…`. Swipe on touch.
   - **Info column** (`lg:col-span-5`, inner `lg:sticky lg:top-[calc(header-h+5.5rem)]`): **tag card** `.tp-tag.tp-board mt-16 lg:mt-20 !rounded-[2.2rem_2.2rem_2.2rem_.6rem] !p-7 md:!p-9` with a **hole ring** (`.tp-tag__ring` 2.2rem, `border 3.5px cocoa`, honey ring with transparent center, white inner highlight; top −1.2rem left 1.5rem) and **string**; whole tag **swings** in on reveal (`tp-tag-swing 1.7s silk`: rotate −7°→4°→−2.2°→1°→−.4°→0, origin at the ring; `--swing .25` <1024) and nudges on hover (`tp-tag-nudge 1.3s`). Teddy `peek` over the top-right edge. Contents: status chip, `h1` plush `clamp(2.6rem,5vw,4.6rem)` (name), breed line `mt-2 text-lg font-semibold text-cocoa-soft`, `dl.mt-7 grid grid-cols-2 gap-x-6 gap-y-4` (dt = scrawl 14px cocoa-soft; dd `mt-.5 text-[1.05rem] font-semibold`): **Breed / Boy or girl / Age / Where** (+ **Colour** when present, e.g. "Golden Cream", "Marble"); `Where` values: "Imported for you" / "In Dubai". CTAs `mt-8 flex flex-col gap-3`: green "Ask about Copper on WhatsApp" (`https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'm%20interested%20in%20Copper%2C%20the%20Cavapoo%3A%20https%3A%2F%2Fpuppy.instabizweb.com%2Fpuppies%2Fcopper-male`) + ghost "Send an enquiry" (`#enquire-<slug>`, smooth-scrolls). Gone puppies: stamp instead of chip and green button "Ask about a puppy like this".
   - Below it **"what comes with" paper** `.tp-paper mt-8 -rotate-1`: chapter 2 "what comes with Copper" + plush `text-[1.9rem]` "Every Teddy Pup comes" + `ul mt-4 space-y-2.5` each `flex gap-3 font-semibold` with a toffee check icon: Vaccinated · Dewormed · Verified health certificate from licensed vets · Thoroughly checked before joining your family.
4. `section.mt-20`: chapter 3 "the way home" + `h2.text-big mt-3` "Coming home from abroad" + `ol.tp-trail.tp-trail--row.tp-trail--paws mt-10` (4 steps; ≥1024 horizontal `grid-auto-flow column; gap 2.5rem` with a **row of paw prints** (toffee, α.55, mask-tiled 1.35×1rem) connecting the numbered discs; <1024 vertical with a column of paws at left 1.15rem): number disc `.tp-trail__num` 3.4rem (54px) plush 1.75rem; title `font-plush-text text-xl font-bold leading-tight`; text `mt-2 max-w-[38ch] text-cocoa-soft`. Steps: **Reserve your puppy** "Tell us which puppy has captured your heart." · **Personalized consultation** "We finalize details with you and share updates on your puppy's journey." · **Import and arrival** "We manage health checks, travel arrangements, and documentation." · **Welcome home** "We help your new puppy settle in and ensure a smooth transition into your home."
5. **Enquiry letter** `section.tp-letter mt-20 grid gap-10 lg:grid-cols-12 id=enquire-<slug>` (§3.9 for fields): left `lg:col-span-4` chapter 4 "dear TeddyPups…" + `h2.text-big mt-2` "Ask about Copper" + "Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply."; right `lg:col-span-7 lg:col-start-6` form. (Gone puppies: heading "Looking for a puppy like this?".)
6. **Prev/next pup** cards (2-col, each `border 3px cocoa; radius 1.6rem; padding; flex` with a small arch photo 5rem + "Previous pup"/"Next pup" scrawl 14px + name plush ~1.7rem; right card right-aligned) then the dark footer hill.
- Gallery counts per puppy: 1–11 media (Korean teacup maltipoo has 11 incl. video; maltipoo-female-2 has 4 photos + 3 videos).
- Screens: `steps/puppy-copper-male-1440/00–04`, `puppy-gone-detail-*`, `puppy-video-gallery-1440.png`, mobile `steps/puppy-copper-male-375/`.

### 4.4 GONE HOME `/gone-home` ("Gone home" tickets)

- Container `gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16`. Header `.tp-boothhead grid gap-10` (≥768 `grid-cols minmax(0,1fr) auto`, `items-end`): left `max-w-3xl` → h1 plush `text-giant` "Gone home" + a toffee **heart outline** svg after it, lede "Every puppy here has already joined a loving family. Looking for one just like them? Tell us — we'll help you find your match." (`text-lede mt-6 text-cocoa-soft`), primary "See available puppies" (`mt-8`); right **ticket booth** `.tp-booth` (`--bw: clamp(11rem,30vw,15rem)`; `justify-self end`): Teddy (`peek`) above a counter (`height bw×.42; margin-top −bw×.272; border 3px cocoa; radius .9rem .9rem .4rem .4rem; awning stripes toffee/milk 2.6rem in a 2.05rem band + 3px rule; bg #fff1d8→#fbe3b4; shadow 6px 8px rgba(42,23,14,.14)`) with scrawl label "tickets home" (plush 1.4rem toffee-ink).
- **Tickets** `ul.tp-tickets` `mt clamp(3rem,7vw,5rem); grid-template-columns: repeat(auto-fill, minmax(min(100%,21rem),1fr)); gap 2.25rem 1.75rem` → **3 cols @1440 (419px each)**, 1 col mobile. 27 tickets, each `li.tp-ticket` (`rotate var(--tilt)` −1.5…1.5°, hover rotate 0 `.45s pounce`) → `a.tp-ticket__link` (`min-h 9.5rem; filter drop-shadow(5px 7px rgba(42,23,14,.16))`; hover `translateY(−4px)` + bigger shadow `8px 12px …`): **main** (`border 3px; border-right 0; bg #fff8ea; radius 1rem 0 0 1rem; padding .95rem 1rem .95rem .95rem; flex gap 1rem`; right edge has **half-circle perforation notches** via radial-gradient mask r .62rem) = round photo (`aspect 1; border 3px; radius 50%; width clamp(5.4rem,22vw,6.6rem)`) + body: kicker "one ticket home" (scrawl .9rem toffee-ink), name (plush `clamp(1.4rem,2vw,1.75rem)`), meta "Pomeranian, boy" (.9rem/600), route line `TEDDYPUPS ┄┄➤ HOME ♥` (`.82rem/700 uppercase ls .04em`, dotted arrow svg 2.6rem toffee-deep) — origin text is "TEDDYPUPS" for imported and "DUBAI SHOWROOM" for Dubai-sold puppies; **stub** (`width 3.4rem; honey; border-left 3px dashed rgba(42,23,14,.55); radius 0 1rem 1rem 0; mirrored notches`) with vertical text "admit one" (`writing-mode vertical-rl; rotate 180deg; plush 1rem; ls .06em`); hover: stub `rotate 7deg` (origin 0 0, `.5s pounce`). Reveal: `clip-path inset(0 0 100%) + translateY(−.9rem)` → `inset(−2rem)`, `.7s silk`, stagger `i·80ms`. On mobile the route text clips ("HO…") — keep `overflow:hidden`/min-w-0 behaviour as seen.
- Screens: `steps/gone-home-1440/00–03`, `steps/gone-home-375/`.

### 4.5 HAPPY FAMILIES `/happy-families` (title "Happy families | …")

- Section bg `.tp-memories`: `repeating-linear-gradient(90deg, transparent 0 46px, rgba(194,98,43,.04) 46px 48px)` (vertical wallpaper stripes) + `radial-gradient(70% 40% at 50% 0, rgba(255,214,140,.45), transparent 70%)` + `linear-gradient(#fff3df, #fbe9cc 60%, #f7e0bd)`.
- Head `.tp-memories__head grid gap 2.5rem 4rem` (≥1024 `minmax(0,1fr) minmax(0,28rem)`, `items-end`): kicker "our wall of happy endings" (scrawl 18px) · h1 plush `text-giant` "Happy families" + toffee heart (`.42em`) · lede "Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful moments shared by our amazing clients after welcoming their furry friends." (max-w 50ch) · "64 moments and counting" (scrawl) · right: **note paper** `figure.tp-memories__note` (`rotate 1.4deg; radius .3rem; padding 1.6rem 1.5rem 1.2rem; bg ruled lines (blue `rgba(47,110,158,.13)` every 1.6rem) on #fffdf6; shadow 0 8px 18px −8px rgba(42,23,14,.35)`) with a **blue tape** strip top-center, Sarah M. quote (Fraunces `clamp(1.02rem,1.2vw,1.15rem)`/1.6rem).
- **Wall** `ul.tp-wall`: CSS multi-column `columns: 2 10.5rem` (→ 1 col @375 because 2×10.5rem+gap > 328; **3 cols ≥768; 4 cols ≥1280**), `column-gap clamp(1rem,3vw,2.6rem)`; items `break-inside:avoid; padding 1.1rem .35rem clamp(1.4rem,3vw,2.4rem)` (column-major order: items 1–16 fill column 1, etc.; heights vary by photo aspect: 960×1280 / 1320×1254 …). Measured 1440: 4 cols ≈297px; total list height 7103.
- **Polaroid** `.tp-polaroid`: `bg #fffefb; radius .2rem; padding .6rem .6rem 0; rotate var(--tilt)` (−3…3°), shadow `0 1px 1px rgba(42,23,14,.12), 0 10px 20px −8px rgba(42,23,14,.36)`; photo `inset 1px ring rgba(42,23,14,.08)`, bg `#e8dfd3`, natural aspect; caption `min-h 2.6rem; padding .55rem .2rem .6rem; Shantell .92rem/1.2 cocoa-soft; centered` (only 8 of 64 photos have captions; others show empty caption strip). **Tape** `.tp-tape` (`width clamp(4rem,34%,6.2rem); height 1.35rem; background hatched white lines + gloss gradient over `--tape` (#f6d79a / pink / blue / peach …) at 78%; opacity .88; torn-edge `clip-path polygon`; variants center/left (−9°)/right (8°)/corner tl/tr (±40°)`). Hover: `translateY(−6px) rotate(0)` + bigger shadow `0 18px 30px −14px rgba(42,23,14,.42)` (`.5s pounce`), active −2px; a toffee **paw** stamp pats down on reveal.
- Reveal `tp-print-bound .62s`: `translateY(1.6rem) scale(.9) opacity 0` → bounce squash/stretch `scale(.98,1.03)` → `(1.03,.97)` → 1; tape pops at `d+.42s` (`scale 1.25 .6 → 1`), paw pat `.7s` (`tp-paw-pat`). Click → lightbox (§3.10), counter "n / 64".
- Footer line: Teddy sitting + scrawl "every one of them was a Teddy Pup once" (`.tp-memories__foot`) then footer hill (page bg ends `#f7e0bd`).
- Screens: `steps/happy-families-1440/00–11`, `steps/happy-families-375/`.

### 4.6 HOW IT WORKS `/how-it-works` (single scene, light)

- Header `grid gap-8 md:grid-cols-12 md:items-end`: h1 plush `text-giant md:col-span-7` "How it works"; lede `md:col-span-5 md:pb-4` "Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups is here to make the experience unforgettable."
- Anchor chips `nav.mt-10 flex flex-wrap gap-2`: "1 Two ways home" `#two-ways`, "2 Our premium puppy promise" `#promise`, "3 Delivery & collection" `#delivery`, "4 Why choose us" `#why` (style in §2.5).
- **Two ways home** (`section.tp-journeys`, `margin-top clamp(3.5rem,8vw,6rem)`): top row `grid gap 1.5rem 2.5rem` (≥768 `minmax(0,1fr) minmax(0,36rem)`, `items-end`): kicker "choose your way" (scrawl 1.2rem) + `h2.text-big` "Two ways home"; **switch** `.tp-switch` (role tablist; `grid-template-columns repeat(2,1fr); border 3px cocoa; milk; radius 999; padding .4rem; max-w 32rem; shadow 0 6px 0 −2px rgba(42,23,14,.2)`; a toffee-deep **thumb** (`left .4rem; width (100%−.8rem)/2`) that `translate`s `.5s pounce` between tabs; tab = plush `clamp(1.25rem,2.2vw,1.6rem)` label + hint 13.6px/600; selected colour milk): tab 1 "In Dubai" / "meet in person", tab 2 "Imported" / "order upon request"; Teddy sits to the right (`clamp(6rem,17vw,8.5rem)`, hidden <640).
  - **Panel In Dubai** (`.tp-journey__head` grid ≥900 `1.15fr 1fr gap 3.5rem`): h3 plush `clamp(2rem,4vw,3.25rem)` "Meet your puppy in person" + lede "Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face. We source healthy, well-socialized puppies from trusted local breeders, ensuring they're raised with care, proper nutrition, and veterinary checks." + **postcard** `.tp-postcard` (`aspect 16/9; border 3px; radius 1.6rem; bg linear-gradient(#fff1d8,#fbe3b4); rotate 1.2deg; shadow 8px 10px rgba(42,23,14,.12)`: warm sun disc 22% at (62%,18%), Dubai skyline line-art along the bottom (cocoa α.8), label "Downtown Dubai" scrawl 1.05rem top-left). Steps `ol.tp-steps` (`grid repeat(auto-fit,minmax(min(100%,15rem),1fr)); gap 1.25rem` → **4 cols ≥1100, gap 1.5rem**): `.tp-step` cards (`border 3px; milk; radius 1.6rem; padding 1.5rem 1.4rem 1.6rem; shadow 6px 8px rgba(42,23,14,.1); hover translateY(−4px) rotate(−.6deg) + shadow 9px 12px .12`) with tinted blob icon (`4rem`, radius `46% 54% 52% 48% / 55% 45%`, tints peach/blush/sky/mint; 2.6rem line icon toffee-deep), "Step 1" (plush 1rem toffee-ink), title `font-plush-text` 1.3rem/700, text cocoa-soft. Enter animation `tp-step-in .55s pounce` (translateY 1.25rem, rotate 1.5°) stagger `i·90ms` when `data-ready`. Steps (local): Explore our puppies — "Browse our website to view the available puppies. Each listing includes photos, breed details, age, and health information." · Choose your puppy — "Once you find a puppy you love, open their profile for more information or to enquire further. You can also reach out to us directly if you have any questions." · Meet before you choose — "Spend time bonding before making your decision." · Pick-up or delivery — "Pick up your puppy from us or have them delivered to your home within Dubai. Our delivery service is safe and reliable, ensuring your puppy arrives comfortably." Icons (magnifier-heart, heart-check, puppy face, delivery truck).
  - **Panel Imported** (hidden attr toggled): h3 "Order upon request" + copy "Looking for a truly exceptional companion? Our Order Upon Request service gives you access to some of the world's most sought-after teacup breeds — ethically sourced from the most reputable, certified breeders across Europe, Korea, and beyond." + scrawl toffee-ink note "From Korean teacup poodles to rare Maltese, Pom, and Yorkie lines, we bring the world's finest puppies to Dubai, just for you." + postcard (`--sky` variant: `linear-gradient(#e3f0fb,#fff6e8)`, rotate −1.2deg, dotted toffee arc, bobbing plane (`tp-plane-bob 3.2s`), labels "Europe · Korea" / "Dubai") + steps (Reserve your puppy — calendar-check; Personalized consultation — chat bubbles; Import and arrival — plane; Welcome home — house-heart; copy in `content.md`). Screen: `how-it-works-imported-tab-1440.png`. Tab ARIA: `role=tab`, ids `tab-local/tab-imported`, `role=tabpanel` `panel-*`.
- **Our premium puppy promise** (`section.tp-paper mt-24 -rotate-[.6deg] id=promise`): kicker "puppy passport", `h2.text-huge max-w-[16ch]`, 3 stamps (`ul.mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3`): Hand-selected breeders (round, heart-pulse) · Full transparency (ticket, plane) · Safe, stress-free delivery (oval, chat). Captions: "We work only with breeders who uphold the highest ethical and health standards." / "Photos, videos, and health certificates are shared before your puppy travels." / "We handle every detail of the import process, so your puppy arrives happy, healthy, and ready to love you."
- **Delivery & collection** (`section.mt-24 grid items-center gap-10 lg:grid-cols-12 id=delivery`): left `lg:col-span-6`: `h2.text-huge` + lede "From a same-day visit in Downtown Dubai to a flight from Korea, every puppy travels comfortably and arrives safely." + `ul.mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2` four items (`font-plush-text text-[1.3rem] font-bold leading-snug` title + `mt-1.5` ink-soft text): Take your puppy home the same day · Delivery within Dubai · Safe international cargo · Worldwide delivery. Right `lg:col-span-6` `h-[clamp(14rem,30vw,22rem)]`: the **flight scene** (dotted route Korea → Dubai over the skyline line-art, big plane with a puppy porthole, `tp-flight`).
- **Why choose us** (`section.mt-24 grid gap-12 lg:grid-cols-12 id=why`): left `lg:col-span-5` h2 + lede "We're here to help you find a new family member. …"; right `ul.space-y-8 lg:col-span-6 lg:col-start-7` three `li.flex gap-5` with a toffee line icon (plane / chat / heart-pulse, `size-14`) + plush `text-[1.7rem]` title + text: International cargo · Support 24/7 · Health guarantee.
- **Final CTA card** `.tp-board` (3px, inner dashed): h2 plush "Unique and high quality puppies" + paragraph "When you choose TeddyPups, you can trust that you're getting a puppy of the highest quality. We also provide guidance and support to new pet owners, offering advice on training, nutrition, and general care to ensure a smooth transition for you and your new furry friend." + green "Ask us on WhatsApp" + ghost "See available puppies"; a **running Teddy** illustration right side (`pup-buddy` happy-run pose with shadow ellipse).
- Section background: `linear-gradient(#fffbf3 → #f6cc85)` (cream to amber), footer hill.
- Screens: `steps/how-it-works-1440/00–05`, `steps/how-it-works-375/`.

### 4.7 FAQ `/faq` (dark corkboard)

- Section `.tp-scene.tp-faqroom` (dark tone): sky `linear-gradient(#a95e32 → #331c11)` (`--sky-top/--sky-bottom`), a large warm radial glow `::before` (`aspect 1.6; width min(80rem,140vw); radial closest-side rgba(255,214,140,.42) → .12 55% → 0; top 18rem; left 50%; translate −38%`), `overflow:hidden`. Text milk.
- Header `max-w-4xl`: h1 plush `text-giant` "Questions & answers" (milk; the `&` is the WONK ampersand) + lede "Can't find what you're looking for? Message us on WhatsApp — our team is available 24/7." (`max-w-[52ch] mt-6`).
- `.tp-notes` (`mt-12 md:mt-16`; grid gap 2rem; **≥1024 `grid-cols minmax(15rem,21rem) minmax(0,1fr); gap clamp(2rem,4vw,4rem); align-start`**): 
  - **Aside** (`position:sticky; top: header-h + 2rem` ≥1024; <1024 2-col with Teddy right): label "sniff out a question" (scrawl 1.15rem), search (§3.9), count "9 notes on the board" (`650`; filtered: "2 notes found"), Teddy (`width clamp(8rem,34vw,11rem); margin 2.75rem 0 0 1rem`) with a **thought bubble** (`3.1rem` milk circle, `border 3px`, radius `50% 50% 50% .4rem`, shows "?" idle → "!" when a note is open / pup is speaking), green "Ask your own question" button (→ WhatsApp prefilled "Hi TeddyPups! I have a question:").
  - **Board** `.tp-notes__board`: cork `#c99a62` with 3 speckle radial layers, `border 3px cocoa; radius 1.4rem; padding clamp(1.6rem,4vw,3rem) clamp(1rem,3.5vw,3rem) clamp(2rem,4vw,3rem)`, inner wooden frame via inset shadows `inset 0 0 0 12px #8a5a33, inset 0 0 0 15px cocoa, inset 0 18px 30px −12px rgba(42,23,14,.45)` + hard drop `10px 14px 0 rgba(0,0,0,.18)`. List `max-w 46rem; gap clamp(1.6rem,3vw,2.2rem)`.
  - **Note** `li.tp-note` (`border 3px cocoa; radius .5rem; bg linear-gradient(#fffcf3,#fff5e2); shadow 4px 7px rgba(42,23,14,.25); rotate var(--tilt)`; alternate horizontal shift `±1.4rem` (≥1024; `±.5rem` below)): **push-pin** (`1.45rem` circle, `2.5px cocoa`, glossy radial highlight, colours cycle toffee/blue `#2f6e9e`/honey/pink, shadow `2px 4px`) top-center; **folded corner** `::after` (1.7rem triangle bottom-right, `#f0dcb6/#c99a62`) that shrinks to 0 when open. Question button `padding 1.35rem 1.4rem 1.2rem; plush-text bold clamp(1.1rem,1.6vw,1.3rem)/1.3; flex; chevron` (3px toffee-deep L-shaped `0.85rem`, rotates 45°→225° `.45s pounce`). Answer: `grid-template-rows 0fr → 1fr` `.55s silk`, inner `p` (cocoa-soft; `border-top 2px dashed rgba(42,23,14,.28); margin 0 1.4rem 1.4rem; padding-top 1rem`) **unfolds** `rotateX(−82deg) → 0` (origin top, perspective 700px, `.6s silk`, opacity .35s, +80ms). Open note: `rotate 0; scale 1.015; shadow 8px 14px rgba(42,23,14,.25); z 2`. **Single-open accordion** (verified: opening note 3 closed note 1), `aria-expanded`, answer `role=region`. Search: live filter by substring over questions+answers, `<mark>` highlight (`linear-gradient(transparent 55%, rgba(242,190,107,.85) 55%)`), empty state note "no notes match" style (`.tp-note--empty`).
  - Reveal: notes drop in `opacity 0, translateY −1.6rem, rotate tilt+5°` → settle (`.7s pounce`, stagger `min(i,6)·70ms`), pins scale 0→1 after `.35s`.
- 9 Q&A: see `content.md` (Are your puppies vaccinated and health-checked? / Can I meet a puppy before I decide? / Can I take my puppy home the same day? / Do you import puppies from abroad? / How does an imported puppy travel to Dubai? / Will I see photos and health details first? / Do you deliver? / Which breeds do you usually have? / Is there help after my puppy comes home?).
- Bottom: wavy dark hill into footer (same as other dark-footer pages).
- Screens: `faq-expanded-1440.png`, `faq-search-korea-1440.png`, `steps/faq-1440/`, `mobile-real-faq-viewport-375.png`.

### 4.8 CONTACT `/contact` ("Get in touch with us")

- Header `grid gap-6 lg:grid-cols-12 lg:items-end`: h1 plush `text-giant max-w-[12ch] lg:col-span-7` "Get in touch with us"; lede `lg:col-span-5 lg:pb-3` "Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether ready to adopt or just seeking info, we'd love to hear from you!" Page bg = `linear-gradient(#fff9ee → #f9dca4)` (`--sky-top/--sky-bottom`) ending in the dark footer hill.
- Grid `mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14`:
  - **Letter** (`lg:col-span-7 lg:col-start-6 lg:row-start-1`, so on desktop the letter is on the RIGHT, contacts on the left; on mobile the letter comes FIRST): `.tp-post` → `form.tp-letterform` (`border 3px cocoa; milk; radius 1.6rem; padding clamp(1.5rem,4vw,2.75rem); shadow 8px 10px rgba(42,23,14,.16)`; a **red margin line** at `clamp(1.5rem,4vw,2.75rem) − .75rem` (`rgba(194,98,43,.28)` 1px, via gradient bg); corner **stamp** (paw) 4.75rem rotated 6° top −1.25rem right 2rem). Contents: greeting "Dear TeddyPups," (scrawl `clamp(1.4rem,2.4vw,1.75rem)` toffee-ink); sentence lines (`clamp(1.05rem,1.5vw,1.2rem)`, **line-height 2.55**): "my name is [name blank 12rem?], and you can reach me on [phone blank placeholder "+971 50 123 4567"] or by email at [email blank placeholder "optional"]." / "I live in [area blank "e.g. Dubai Marina"], and I'm curious about [select: "any puppy (not sure yet)" + one option per available puppy e.g. "Max (Maltipoo, boy)" … 15 options]." Blanks `.tp-blank input/select`: `height 2.2rem; Shantell 1.12rem toffee-ink; transparent; border-bottom 2.5px dashed rgba(42,23,14,.45); radius .3rem .3rem 0 0; padding 0 .25rem`; focus → solid toffee-deep underline + `rgba(251,227,180,.6)` bg; invalid → blush bg + solid `#b3261e`; select has two-triangle toffee-deep arrow, ellipsis. Then a **ruled textarea** `.tp-letterform__note` (3 lines, `line-height 2.3rem`, ruled `repeating-linear-gradient(transparent 0 calc(2.3rem−2px), rgba(42,23,14,.16) …)`, Shantell 1.1rem toffee-ink, placeholder "Anything else you'd like to tell us…", `resize vertical`, max 2000). Sign-off row `flex justify-between items-center gap 1rem 1.5rem; mt 1.6rem`: "with love, a future puppy parent" (scrawl 1.1rem cocoa-soft) + primary "Post my letter" (submit). Error alert (`.tp-letterform__alert` blush bg, radius 1rem, list). Honeypot `website`.
    - **Submit animation (`data-phase` writing → sealing → posting → sent)** *(from CSS; not triggered during research — never submit)*: letter folds `tp-letter-fold .65s snap` (rotateX 62°→80°, scale .8→.35, fade); an envelope (11rem) pops in (`tp-env-in .45s pounce` scale .4→1) and its flap closes (`.3s ease-in`); envelope drops into a **mailbox** (13rem) that slides up (`tp-box-up .5s pounce`), envelope `tp-env-post .85s snap` (translateY −1.2rem then 12.5rem, scale .55), mailbox **flag** raises (`tp-flag .4s pounce`, rotate 90°→0); then a honey success card `.tp-post__sent` (`border 3px; radius 1.6rem; padding clamp(2rem,5vw,3rem) 1.5rem; tp-sent-in .55s pounce`) with the mailbox (9rem) + thank-you copy.
    - Teddy sits under the letter (`ml-auto mr-6 -mt-3 w-36 md:w-40`, facing left).
  - **Contact column** (`lg:col-span-5 lg:row-start-1`): green button "WhatsApp +971 54 167 6733" (`w-full sm:w-auto`); `dl.mt-10 space-y-6` "call us" → `+971 54 167 6733` (`link-ink`, `tel:`), "email" → `teddypupsadmin@gmail.com`; **shopfront** `.tp-shopfront mt-12` (awning stripes; `.tp-visit p-7 pt-6 grid`, ≥640 `grid-cols minmax(0,1fr) 11rem items-end`): h2 plush `text-[2rem] leading-tight` "Visit us in Downtown Dubai", "Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face." (`max-w-[38ch]`), paw-pin icon + "Downtown Dubai, United Arab Emirates" (`font-semibold`), ghost button "Open in Google Maps" (`!bg-milk`, `https://maps.app.goo.gl/ZdJvwHBSQWWZT54s…`), arch photo `.tp-visit__photo` (`aspect 3/4` (4/3 <640); `border 3px; radius 999px 999px 1rem 1rem`, puppy image) and a faint Dubai skyline outline along the bottom of the card.
- Screens: `steps/contact-1440/`, `steps/contact-375/`.

### 4.9 404 (`not-found`)

Full header/footer. Centered **"LOST" poster** `.tp-poster` (`width min(100%,34rem); border 3px; radius .6rem; bg radial highlight on #fff6df; rotate −1.2deg; padding clamp(1.6rem,5vw,2.6rem) clamp(1.2rem,4.5vw,2.4rem) 0; shadow 8px 12px rgba(42,23,14,.16)`; enters `tp-poster-in .9s pounce` (translateY −1.5rem, rotate 3° → rest); two tape strips on top): "have you seen this page?" (scrawl `clamp(1.1rem,2.4vw,1.35rem)` toffee-ink), **"LOST"** plush `clamp(4rem,15vw,7.5rem)` uppercase ls .02em, a dashed photo frame (`width min(70%,17rem)`, `3px dashed rgba(42,23,14,.4)`) with Teddy standing, text "One page, last seen wandering off. It answers to the address you typed, but it isn't here any more. Teddy is on the case.", "if found, take a tab:", **tear-off tabs** (`ul.grid-cols-5`, top dashed rule `2.5px dashed rgba(42,23,14,.5)`, vertical-rl labels `Home, Puppies, How it works, Questions, Contact`, `height 8.5rem`; hover rotate ±8° + honey-soft bg `.45s pounce`). Status 404. Screen: `404-1440.png`.

---

## 5. Component micro-specs (details referenced above)

### 5.1 Polaroid / tape / print — see §4.5.
### 5.2 Stamps — §4.1E. Stamp mask = SVG feTurbulence `baseFrequency .85, numOctaves 2, seed 7` thresholded → grunge speckle (`mask: url(data:image/svg+xml…) 0 0/160px 160px`).
### 5.3 Dark footer hill — §3.3. Warm-to-dark hill also appears at the bottom of gone-strip/memories/how/faq/contact pages (same path, filled with `--night`).
### 5.4 Icon set (inline SVG line icons, 2.4–3px strokes, round caps): paw (64-box path `M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 …` + 4 toes), heart, heart-pulse, plane, chat bubble, globe, magnifier, magnifier-heart, check, truck, house-heart, calendar-check, sparkle, star, pin. All in `assets/svg/`.

---

## 6. Interactions inventory (with timings)

| # | interaction | spec |
|---|---|---|
| 1 | Intro curtain | on first load, 1.04 s total; see §2.9 |
| 2 | Route curtain | link click: cover .3s silk → push → lift .46s `cubic-bezier(.65,0,.3,1)`; fallback timeout 6 s |
| 3 | Header hide/show | scrollY>220 & Δ>6 down → hide `.5s silk`; up → show; `data-scrolled` at >8 → milk bg + hem fade `.35s` |
| 4 | Nav hover | colour `.25s`; paw `scale .4→1 .45s pounce`, opacity .45; active paw opacity 1 |
| 5 | Logo hover | `rotate −8deg .6s pounce` |
| 6 | Buttons | hover lift+tilt `.35s pounce`, shadow `.35s silk`; active scale .96 |
| 7 | Mobile menu | §3.2 (open .5s snap circle reveal; links stagger .55s pounce; close .42s snap) |
| 8 | Lenis smooth scroll | desktop pointer only |
| 9 | Paw trail + custom cursor | §2.10 |
| 10 | Hero lineup | idle cycle every ~1.7–2.8 s: duck .34s → swap → pop .58s pounce, tag 1.8 s; hover lifts photo −12% & shows tag; intro `tp-peek .75s pounce` stagger 90ms from .62s |
| 11 | Pinned doors | §4.1B; open threshold ≈.45 vw; leaf `1.05s cubic-bezier(.3,1.32,.48,1)`; hover opens door |
| 12 | Teddy | §3.6 |
| 13 | Journey steps | IO band `-28%/-62%`; msg group reveal `.5s pounce`, typing dots `.75s` |
| 14 | Stamps | `view()` driven scale/rotate settle |
| 15 | Sun set | `view()` driven translate |
| 16 | Photo wall reveal | `.75s pounce`, tape `.35s`, delays by `--d` |
| 17 | House door | opens on scroll (`view()` 80%→52%) |
| 18 | Stars | twinkle 3.2s infinite staggered |
| 19 | Sketch cards | reveal draw-on (§4.2), hover counter-rotate `.6s pounce`, doodle hop |
| 20 | Filters | chip toggle; URL sync; count updates; clear filters |
| 21 | Ticket | hover lift −4px + stub rotate 7° |
| 22 | Polaroid | hover lift −6px/rotate 0; click → lightbox |
| 23 | Detail gallery | prev/next/thumb/swipe/keyboard in lightbox; Motion spring slide |
| 24 | Detail tag | swing-in `1.7s silk`; hover nudge `1.3s` |
| 25 | Ribbon | scroll progress fills |
| 26 | Switch tabs (how-it-works) | thumb `.5s pounce`; panel swap, steps `tp-step-in` stagger 90ms |
| 27 | FAQ | open note: row grid .55s silk, unfold .6s, chevron .45s pounce; search filter + mark; count text |
| 28 | Contact letter | focus underline solid + tint; submit sequence (§4.8) — not triggered |
| 29 | Sticky WhatsApp/Call bar | static, <768, always on top of content (z 40) |
| 30 | Hash links | smooth scroll via Lenis/scrollIntoView, pushState |

---

## 7. Data & assets

- **`puppies.json`** (42 records; 15 `available`, 27 `gone`; 132 media entries incl. 6 videos). Fields: `slug, url, name (display name; may equal breed when unnamed), breedLabel, details{Breed, "Boy or girl", Age, Colour?, Where}, statusChip ("Available"|"Gone home"), gone (bool), metaTitle, metaDescription, media[] {id,url(absolute original),kind image|video,width,height,alt,caption,focalX,focalY,color,durationS,poster}`, and for the 15 listed puppies a `listing{id,displayName,gender (male|female|male-female),genderLabel,age,colour,status,featured,origin{slug,name},breeds[],collections[]}`. `Where: "Imported for you"` for all 15 available; gone ones mix "Imported for you" and "In Dubai" ("DUBAI SHOWROOM" on tickets). Collections: only `korean-teacup` (5 puppies: Korean Teacup Maltipoo F, Poodle F, Pomeranian ×3). Slugs in sitemap order are in the file. Media base `https://puppy.instabizweb.com/media/<id>/<hash>/<file>` (original quality); site serves via `/_next/image?url=%2Fmedia%2F…&w=…&q=75`.
- **`happy-families.json`** — 64 photos (`/media/…jpeg`, 960×1280 or 1320×1254), 8 with captions (home photowall shows these 8: "Lulu 🧸 with her new mummy ❤️", "Adorable Maltipoo baby 🧸❤️", "My new teddy puppy 🥰🧸", "Our new puppies 🧸🥰🤗", "New puppy 🧸😍", "Gang of 3 😍🧸", "So happy 😍😍", "New pup 🤗💫"); alt "A happy TeddyPups family with their new puppy". Testimonial: Sarah M., Dubai, UAE.
- **Brand** (`assets/brand/`): `logo.png` 800², `icon.png` 512² (favicon `/icon.png`), `apple-icon.png` 180², `paw-cursor.svg`, `paw-press-cursor.svg`.
- **Images:** `assets/puppies/<slug>/NN.ext` (132 files), `assets/videos/*.mp4` (6; up to 6.5 MB), `assets/happy-families/NN.jpg` (64). Mapping: `assets/mapping.json` (url → file, bytes).
- **SVGs:** `assets/svg/` 151 files; index `assets/svg/INDEX.md`. Of note: `mascot-teddy-*.svg` (13 pose snapshots + basket), `curtain-*`, `quilt-01`, `header-01` (hem), `horizon-01`, `flight-*`, `way-scene-01`, `stamp-*`, `step-icon-*`, `postcard-*`, `shopfront-*`, `night-stars-*`, `footer-*` (hill + stars), `sketch-frame-*` (40 generated ink/wash/mask samples), `msg-01` (route sketch), `phone-compose-01`, `wall-print-01` (paw), `door-leaf-01`.
- **Fonts**: load from Google via `next/font/google` with axes (see §2.2); their woff2 are self-hosted at `/_next/static/media/*.woff2` (not copied).
- **Copy**: `content.md` (all pages in DOM order, header/footer/menu/sticky bar, SEO titles/descriptions).
- **Metadata**: title template `"<Page> | TeddyPups U.A.E."`; description per page in `content.md`; og:image = cover; canonical per page; manifest/icon as above. Sitemap lists `/`, `/puppies`, `/gone-home`, `/happy-families`, `/how-it-works`, `/faq`, `/contact` + 42 detail pages.

---

## 8. Build notes / gotchas for the clone

1. Use `next/font/google` with `axes: ['SOFT','WONK','opsz']` for Fraunces and `axes: ['BNCE','INFM']` for Shantell Sans, `weight: 'variable'`, then apply `font-variation-settings` via the utility classes above — otherwise the chunky "plush" look is lost.
2. Scroll-driven CSS (`animation-timeline: view()`) is guarded by `@supports (animation-timeline: view())`; fallback = static end state. Safari/Firefox visitors get no door-swing etc. — match that.
3. `overflow-x: clip` on html/body (not `hidden`) so `position:sticky` keeps working (pinned doors, phone, FAQ aside, detail tag).
4. The pinned doors section: compute height in JS from `track.scrollWidth` (`100vh + (scrollWidth − innerWidth)/1.25`), toggle `data-pinned` at ≥1024, drive translateX via rAF with ~.1 lerp, set `data-open` by door centre vs ≈.45·vw.
5. `html { scrollbar-gutter: stable }` — keep, it affects measured widths (viewport 1440 → 1425 content).
6. Intro curtain holds scroll (`html:has(> body > .tp-curtain[data-state=intro]) { animation: 1.04s tp-hold-still }` → `overflow-y:hidden`).
7. Mobile (<768) specifics: sticky bar adds `--bar-h` bottom padding to footer; header height 64; Menu replaces nav+WA button; Teddy lane mode; doors 1-col; walls 1-col; tickets 1-col; hero lineup re-spaced.
8. Reveal states must start `opacity:0` only after JS arms them (`data-armed`) so no-JS shows content.
9. Use real focal points (`focalX/focalY`) for `object-position` on all puppy photos; `blurDataUrl` placeholders exist upstream (omitted from json to keep it small — can regenerate with `plaiceholder`/next blur).
10. All WhatsApp links: `https://wa.me/971541676733?text=<urlencoded message>`; generic message "Hi TeddyPups! I'd love to know more about your puppies."; per-puppy "Hi TeddyPups! I'm interested in {name}, the {breed}: {absolute url}"; FAQ "Hi TeddyPups! I have a question:". Phone `+971 54 167 6733`.

---

## 9. What could NOT be captured / caveats

- **Form submit sequences** (contact letter fold/post/success; detail enquiry success/error; validation messages) — not triggered (rule: never submit). Spec for those comes from the site's CSS only; no screenshots, no success copy.
- **Exact mascot animation code** (pose interpolation, idle scheduling, speech lines beyond "ooh, photos!", "home soon!", "woof!", "hm?") was inferred from behaviour + CSS; the poses exist as SVG snapshots but the pose-morph math is not documented beyond the list above.
- `/admin`, `/api`, `bkpuppy.instabizweb.com` were not touched (per rules). The `/puppies/korean-teacup-poodle-female` URL returned an intermittent 404 on one early request (200 on retry) — treat as flaky upstream.
- Lightbox / video poster `blurDataUrl`s omitted from JSON; compiled JS bundles were read for behaviour only and deleted from the research folder (not to be copied).
- Home full-page screenshots at 768/1024/1440/375 are visually incomplete by nature (pinned/scroll-linked); use `screenshots/steps/`.
- Hover state screenshots exist for the primary button and sketch card (`card-hover-1440.png`); other hover states are from CSS.
