// "Happy families & puppies" scene (dusk): a testimonial, a wooden wall of taped-up polaroids, and a front door with a street lamp.

import { WallPrints } from "@/components/home/WallPrints";
import { families } from "@/components/home/homeContent";
import { TeddyStop } from "@/components/home/TeddyStop";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { happyFamilyPhotos } from "@/data/happyFamilies";

/** Eight prints fit the 4-column wall; the CSS hides the last two below 1024px. */
const PRINT_COUNT = 8;

export function HappyFamiliesTeaser() {
  // Only the captioned photos are used here, as on the original.
  const prints = happyFamilyPhotos.filter((photo) => photo.caption).slice(0, PRINT_COUNT);

  return (
    <Section scene="dusk" className="home-dusk" aria-labelledby="families-title">
      <div className="home-dusk__sky gutter">
        <div>
          <h2 id="families-title" className="font-plush text-huge">
            {families.title}
          </h2>
          <p className="text-lede mt-5 max-w-[50ch] text-(--ink-soft)">{families.lede}</p>
        </div>
        <figure className="home-dusk__note">
          <blockquote className="font-plush-text">&ldquo;{families.quote}&rdquo;</blockquote>
          <figcaption className="font-scrawl">{families.author}</figcaption>
        </figure>
      </div>

      <div className="home-wall">
        <div className="home-wall__board">
          <WallPrints prints={prints} />

          {/* The wall's foot: a front door, a street lamp and the button to every happy family. */}
          <div className="home-facade">
            <div aria-hidden="true" className="home-lamp">
              <span className="home-lamp__light" />
            </div>
            <div aria-hidden="true" className="home-facade__door" />
            <Button href="/happy-families" className="home-facade__cta">
              {families.cta}
            </Button>
            <TeddyStop pose="sit" className="home-dusk__teddy" />
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="home-pavement" />
    </Section>
  );
}
