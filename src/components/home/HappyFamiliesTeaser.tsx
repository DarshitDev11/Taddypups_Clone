// "Happy families & puppies" scene (dusk): a testimonial, a wooden wall of taped-up polaroids, and a front door with a street lamp.

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { families } from "@/components/home/homeContent";
import { TeddyStop } from "@/components/home/TeddyStop";
import { Reveal } from "@/components/puppies/Reveal";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { happyFamilyPhotos } from "@/data/happyFamilies";

/** Tape colours, cycled over the prints. */
const TAPE_COLOURS = ["#f6d79a", "#f3b8b0", "#a9cdee", "#f6d79a", "#f6d79a", "#e8c39a", "#a9cdee", "#f3b8b0"];
/** Small rotations (degrees) so the prints hang a little crooked. */
const TILTS = [-2, 1.8, -1.2, 2.2, -2.2, 1.4, -1.6, 1.2];
/** The 4th print is held by two corner tapes instead of one strip. */
const CORNER_TAPE_INDEX = 3;
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
          <ul className="home-wall__prints" aria-label="Photos from TeddyPups families">
            {prints.map((photo, index) => (
              <Reveal
                key={photo.src}
                as="li"
                style={{ "--d": `${(index % 4) * 90}ms`, "--tilt": `${TILTS[index]}deg`, "--tape": TAPE_COLOURS[index] } as CSSProperties}
              >
                {/* TODO: open the shared photo lightbox once /happy-families has one; for now a print links to that page. */}
                <Link href="/happy-families" className="home-wall__print">
                  <span className="home-polaroid">
                    {index === CORNER_TAPE_INDEX ? (
                      <>
                        <span aria-hidden="true" className="home-tape home-tape--tl" />
                        <span aria-hidden="true" className="home-tape home-tape--tr" />
                      </>
                    ) : (
                      <span aria-hidden="true" className="home-tape home-tape--center" />
                    )}
                    <span className="home-polaroid__photo">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 46vw"
                        style={{
                          objectFit: "cover",
                          objectPosition: `${photo.focalX * 100}% ${photo.focalY * 100}%`,
                          backgroundColor: photo.color,
                        }}
                      />
                    </span>
                    <span className="home-polaroid__caption font-scrawl">{photo.caption}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

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
