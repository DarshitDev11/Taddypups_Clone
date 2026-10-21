"use client";

// The taped-up polaroids on the home wall. A print opens in the same full-screen viewer as /happy-families.

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { PhotoViewer } from "@/components/happy-families/PhotoViewer";
import { Reveal } from "@/components/puppies/Reveal";
import type { HappyFamilyPhoto } from "@/types/happyFamily";

/** Tape colours, cycled over the prints. */
const TAPE_COLOURS = ["#f6d79a", "#f3b8b0", "#a9cdee", "#f6d79a", "#f6d79a", "#e8c39a", "#a9cdee", "#f3b8b0"];
/** Small rotations (degrees) so the prints hang a little crooked. */
const TILTS = [-2, 1.8, -1.2, 2.2, -2.2, 1.4, -1.6, 1.2];
/** The 4th print is held by two corner tapes instead of one strip. */
const CORNER_TAPE_INDEX = 3;

export function WallPrints({ prints }: { prints: HappyFamilyPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="home-wall__prints" aria-label="Photos from TeddyPups families">
        {prints.map((photo, index) => (
          <Reveal
            key={photo.src}
            as="li"
            style={{ "--d": `${(index % 4) * 90}ms`, "--tilt": `${TILTS[index]}deg`, "--tape": TAPE_COLOURS[index] } as CSSProperties}
          >
            <button
              type="button"
              className="home-wall__print"
              aria-label={`Open family photo ${index + 1} of ${prints.length}`}
              onClick={() => setOpenIndex(index)}
            >
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
            </button>
          </Reveal>
        ))}
      </ul>

      {openIndex !== null && (
        <PhotoViewer
          photos={prints}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
