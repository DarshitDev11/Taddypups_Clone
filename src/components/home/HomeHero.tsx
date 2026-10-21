// Home hero (morning scene): headline, buttons, and a row of puppies peeking over a quilted blanket with Teddy.

import type { CSSProperties } from "react";
import { HeroLineup, type LineupPuppy } from "@/components/home/HeroLineup";
import { hero } from "@/components/home/homeContent";
import { TeddyStop } from "@/components/home/TeddyStop";
import { Button } from "@/components/ui/Button";
import { ScallopEdge } from "@/components/ui/ScallopEdge";
import { Section } from "@/components/ui/Section";
import { focalPosition, getAvailablePuppies, getCoverImage } from "@/lib/puppies";
import { generalWhatsAppLink } from "@/lib/whatsapp";

/** Slugs shown in the six seats when the page loads (the rest swap in later); matches the original's first look. */
const FIRST_SEATS = [
  "korean-teacup-pomeranian-1",
  "korean-teacup-maltipoo-female",
  "korean-teacup-poodle-female",
  "maltipoo-cavapoo-male",
  "pomeranian-female",
  "toy-poodle-male-female",
];

/** First six in FIRST_SEATS order, then the other available puppies. */
function getLineupPuppies(): LineupPuppy[] {
  const available = getAvailablePuppies();
  const first = FIRST_SEATS.flatMap((slug) => available.filter((puppy) => puppy.slug === slug));
  const rest = available.filter((puppy) => !FIRST_SEATS.includes(puppy.slug));

  return [...first, ...rest].map((puppy) => {
    const cover = getCoverImage(puppy);
    return {
      slug: puppy.slug,
      name: puppy.name,
      breed: puppy.breed,
      src: cover.src,
      position: focalPosition(cover),
      color: cover.color,
    };
  });
}

// The quilt colour is the bottom of the hero's own sky, so the blanket melts into the next scene.
const quiltColour = { "--quilt": "#fff1d8" } as CSSProperties;

export function HomeHero() {
  return (
    <Section scene="hero" className="home-hero" style={quiltColour} aria-labelledby="hero-title">
      <span aria-hidden="true" className="home-hero__sun" />

      <div className="home-hero__copy gutter">
        <p className="home-hero__note font-scrawl">
          {hero.note}
          <svg
            viewBox="0 0 220 24"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute -bottom-2 left-0 h-3 w-full text-toffee"
          >
            <path
              d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 30-9 48 0 18 2 22 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>
        <h1 id="hero-title" className="home-hero__title font-plush">
          {hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="home-hero__lede">{hero.lede}</p>
        <div className="home-hero__actions">
          <Button href="/puppies">View available puppies</Button>
          <Button variant="ghost" href={generalWhatsAppLink}>
            Enquire on WhatsApp
          </Button>
        </div>
      </div>

      <div className="home-hero__stage">
        <HeroLineup puppies={getLineupPuppies()} />
        <TeddyStop pose="peek" label="Teddy, the TeddyPups puppy, peeking over the quilt" className="home-hero__teddy" />
        {/* Quilt: drawn after Teddy and the photos so it covers their lower halves. */}
        <div aria-hidden="true" className="home-quilt bg-lattice">
          <ScallopEdge fill="var(--quilt)" className="absolute -top-[39px] left-0" />
        </div>
      </div>
    </Section>
  );
}
