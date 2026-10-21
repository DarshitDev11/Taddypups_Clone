// "The way home": four numbered steps joined by a trail of paw prints. Imported and Dubai puppies take different roads.

import { ChapterLabel } from "@/components/puppies/ChapterLabel";
import type { PuppyOrigin } from "@/types/puppy";

type Journey = {
  title: string;
  steps: { title: string; text: string }[];
};

// Imported copy is the original site's wording. The Dubai journey is written from its "How it works" page,
// because every puppy that is currently available is imported and the original shows no local version.
const JOURNEYS: Record<PuppyOrigin, Journey> = {
  imported: {
    title: "Coming home from abroad",
    steps: [
      { title: "Reserve your puppy", text: "Tell us which puppy has captured your heart." },
      {
        title: "Personalized consultation",
        text: "We finalize details with you and share updates on your puppy's journey.",
      },
      {
        title: "Import and arrival",
        text: "We manage health checks, travel arrangements, and documentation.",
      },
      {
        title: "Welcome home",
        text: "We help your new puppy settle in and ensure a smooth transition into your home.",
      },
    ],
  },
  local: {
    title: "Coming home from our showroom",
    steps: [
      {
        title: "Choose your puppy",
        text: "Open their profile and tell us which puppy has captured your heart.",
      },
      {
        title: "Meet before you choose",
        text: "Visit our Downtown Dubai showroom and spend time bonding first.",
      },
      {
        title: "Pick-up or delivery",
        text: "Collect your puppy from us or have them delivered within Dubai.",
      },
      {
        title: "Welcome home",
        text: "We help your new puppy settle in and ensure a smooth transition into your home.",
      },
    ],
  },
};

type WayHomeProps = {
  chapter: number;
  origin: PuppyOrigin;
  /** Used to make the heading id unique and link it to the section. */
  slug: string;
};

export function WayHome({ chapter, origin, slug }: WayHomeProps) {
  const { title, steps } = JOURNEYS[origin];
  const headingId = `home-steps-${slug}`;

  return (
    <section aria-labelledby={headingId} className="mt-20">
      <ChapterLabel number={chapter}>the way home</ChapterLabel>
      <h2 id={headingId} className="font-plush text-big mt-3">
        {title}
      </h2>
      <ol className="trail trail--row mt-10">
        {steps.map((step, index) => (
          <li key={step.title}>
            <span aria-hidden="true" className="trail__number font-plush">
              {index + 1}
            </span>
            <h3 className="font-plush-text text-xl leading-tight font-bold">{step.title}</h3>
            <p className="mt-2 max-w-[38ch] text-cocoa-soft">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
