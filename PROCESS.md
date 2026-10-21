# How I Built the TeddyPups Clone — Process Explained

> A plain-English explanation of my workflow for the Insta Biz Web assignment, for the interview and the Loom video.
> This file is updated as each phase is finished.

---

## 1. The task

Clone https://puppy.instabizweb.com/ as closely as possible (design, layout, responsiveness, functionality), deploy it, share the GitHub repo, and explain the process in a Loom video.

## 2. Tools I used

| Tool | What I used it for |
|---|---|
| **Claude Code** (desktop app, model **Claude Opus 5.5**) | Main AI pair-programmer: planning, analysing the site, writing code, reviewing |
| **Claude Sonnet 5.5** (as a sub-agent) | Ran the long, detailed design research in the background |
| **Built-in browser pane** (inside Claude desktop app) | Viewing the live site side by side with the chat |
| **curl** (command line) | Downloading the public HTML/CSS to see how the site is built |
| **Playwright** | Automated browser: full-page screenshots at 4 screen sizes + reading exact styles |
| **Chrome DevTools** | Manual checking of spacing, fonts, colours |
| Next.js, Tailwind CSS, TypeScript | Building the clone (same stack as the original) |
| GitHub + Vercel | Source code + deployment |

## 3. My approach in one sentence

**Understand first, then build:** I didn't start coding straight away. I first analysed how the original is built and what it looks like with exact measurements, wrote a plan and a design spec, and only then started building — so the clone is based on real numbers, not guesses.

---

## 4. Step-by-step process

### Step 1 — Planning with AI
I pasted the assignment email into Claude Code and asked it for a proper plan, including how to "reverse engineer" the site.

Instead of just giving a generic plan, Claude first **looked at the real site** so the plan would be specific.

### Step 2 — Source analysis (what is the site built with?)
Claude downloaded the public homepage with `curl` and read it. What we learned and how:

| What we found | How we found it (easy explanation) |
|---|---|
| Built with **Next.js** | The server response header says `x-powered-by: Next.js`, and the page has `_next/` file paths |
| Styled with **Tailwind CSS v4** | The HTML is full of Tailwind class names like `rounded-full border-2 border-cocoa` |
| **Exact brand colours** (e.g. cocoa `#2a170e`, milk `#fffdf8`, toffee `#c2622b`) | Read from the site's public CSS file, where Tailwind stores theme colours as variables |
| **Fonts**: Fraunces, Figtree, Shantell Sans | Font variables in the same CSS file |
| **All pages** (7 main + ~45 puppy pages) | The public `sitemap.xml` file lists every page |
| **Contact form fields + spam protection** | Read the form in the HTML (including a hidden "honeypot" field that catches bots) |
| Puppies are managed from an **admin panel / database** | `/admin` redirects to a separate login site |

**Ethics rule I followed:** only public pages were used. I did not touch their admin or API, did not copy their compiled code, and never submitted their real contact form (it would send a fake enquiry to a real business).

### Step 3 — Writing the plan (`PLAN.md`)
Claude wrote `PLAN.md`: findings, tech stack, folder structure, 6 build phases with time estimates, priority order if time is short, and the Loom outline. I reviewed it and kept it as a living document to change as needed.

### Step 4 — Visual research (what does it *look* like exactly?)
Reading code tells you colours and fonts, but **not** the visual design — shapes, spacing, how the layout changes on mobile, animations. So I did visual research:

1. Opened the site in the **browser pane** and asked Claude to analyse what it sees. It spotted details like arch-shaped photo frames, a cartoon puppy face, a scalloped edge, a diamond pattern background and tilted handwritten labels.
2. Gave the long research job to a **Claude Sonnet 5.5 sub-agent** running in the background (a separate AI worker), so the main session stayed free.
3. The agent used **Playwright** (a tool that controls a real browser from code) to:
   - take **full-page screenshots** of every page at **375px (phone), 768px (tablet), 1024px (laptop), 1440px (desktop)**, plus close-ups of the menu, hover states, FAQ and gallery;
   - read **exact computed styles** for every heading, button, card and section — font size, spacing, rounded corners, shadows, transitions. This is the same as clicking each element in Chrome DevTools, but automatic;
   - collect **all puppy data** into `research/puppies.json`, **all page text** into `research/content.md`, and the **images** into `research/assets/`.
4. Everything was summarised into **`research/DESIGN-SPEC.md`** — a build guide with exact numbers for every section.
5. I checked the agent's work: opened its screenshots and compared them to the live site before trusting the spec.

**What the visual research revealed** (none of this was visible from the code alone):
- The site is a **scroll-driven "storybook"**: the home page goes from morning to night as you scroll, and each section is an illustrated scene.
- A cartoon mascot, **Teddy**, follows you down the page, changes pose and shows speech bubbles.
- "Meet the pups" is a row of **arched doors** that scrolls **sideways** while you scroll down, and the doors swing open to show each puppy.
- Every page has its own theme: a **sketchbook** for puppies (with filters), **tickets** for gone-home, a **polaroid wall** for happy families, a **corkboard** for FAQ and a **letter** for the contact form.
- Fonts use special **variable font settings** (e.g. Fraunces "SOFT" and "WONK"); without them the headings look wrong.
- A **page transition "curtain"** with a running puppy plays between pages.

Because of this I **re-prioritised the plan** (PLAN.md §1b): make every page look right first, then add the animations, and leave the moving mascot for last.

**Numbers:** 263 screenshots, 42 puppies, 64 family photos, 151 SVG illustrations, 6 videos, ~560 lines of design spec. The agent made 190 tool calls over about an hour.

**Why this matters:** building from measured numbers (e.g. "button padding 14px 28px, radius 999px") gets much closer to the original than building by eye.

### Step 5 — Building *(to be filled in)*
- Project setup (Next.js + Tailwind + fonts + colour tokens)
- Shared parts: header, mobile menu, footer, sticky WhatsApp bar
- Pages, one section at a time, compared against the screenshots
- Contact form with validation and spam protection

### Step 6 — Testing *(to be filled in)*
- Side-by-side screenshot comparison: original vs clone at all 4 sizes (same Playwright script)
- Lighthouse scores, real phone test, `npm run build` with no errors

### Step 7 — Deployment *(to be filled in)*
- GitHub repo → Vercel (auto-deploys on every push)

---

## 5. Exact prompts I used

The prompts I typed into Claude Code (as written, in order):

1. *(Pasted the full assignment email, then:)* "now i get this task from the company that i need to give tommorow so we need to work on that let me how we need to complete this like do any reverese engineering or something give me proper plan for this"
2. "first make the folder in this project folder where we write our whole project code so do that and i need some confirmation from you like do you have done any browser reaserch like we need to make this exact clone so it will really help full to us so let me know don't just built and make one .md file put that in that foldder for this whole thing plan we can also do some changes on that plan as per requirements so please."
3. "now let me know how we can do this browser research like you can really see the exact design so you get the idea like how we can make same exact guide me the way for this first please."
4. *(With a screenshot of the site in the browser pane:)* "see the image tell me what you can do to analyze this please and use the sonnet model 5.5 for analyze this so do it all the thing that needed."
5. "also make one .md file that contain this whole process explaination so i can explain interviewer like how in do the clone part thing using claude ai kind of in the easy technical terms please"

*(More prompts will be added as the build continues.)*

---

## 6. Key decisions and why

| Decision | Why |
|---|---|
| Same stack as original (Next.js + Tailwind) | Easiest way to match behaviour and styling exactly; it's also a modern, in-demand stack |
| Research before coding | Avoids rework; every component is built from real measurements |
| Use a sub-agent for research | Long, repetitive work runs in the background on a fast model while I keep planning |
| Playwright screenshots saved to disk | Reference for the whole build, and reused later to compare clone vs original |
| Puppy data in a JSON file (DB optional) | Fast to build; same data shape can move to a database for an admin panel |
| Placeholder phone/WhatsApp + "demo" note | So the clone isn't mistaken for the real business |

## 7. Challenges *(fill in as they happen)*
- Code alone doesn't show the visual design → solved with screenshots + automated style measurement.
- Animations can't be seen in still screenshots → read animation settings from the CSS and checked by watching the site.
- The home page has pinned and scroll-linked sections, so a normal full-page screenshot comes out broken → took **"scroll-step" screenshots** (one per screen height while scrolling) instead.
- The site turned out to be much more complex than it looked (a storybook with a mascot) → re-prioritised: core pages first, animations second, mascot movement last.
- Couldn't test the contact form's submit animation without sending a fake enquiry to a real business → rebuilt it from the CSS rules only.

## 8. How I used AI responsibly
- I reviewed every plan and file the AI produced and asked it to explain its findings.
- I understand each step: how the stack was identified, how styles were measured, how the pages are structured.
- AI did the repetitive work (screenshots, measuring, data collection); I made the decisions (scope, priorities, what to build first).
