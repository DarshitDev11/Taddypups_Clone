// The masonry wall of polaroids. Clicking a print opens it in the full-screen photo viewer.

"use client";

import { useState, type CSSProperties } from "react";
import { PawIcon } from "@/components/decor/icons";
import type { TapeVariant } from "@/components/decor/MaskingTape";
import { Polaroid } from "@/components/happy-families/Polaroid";
import { PhotoViewer } from "@/components/happy-families/PhotoViewer";
import { Reveal } from "@/components/puppies/Reveal";
import type { HappyFamilyPhoto } from "@/types/happyFamily";

// Each print gets a tilt, tape colour and tape position from these short cycles. The lengths differ
// (8 and 5), so the pattern only repeats every 40 photos and the wall never looks stamped out.
const TILTS = [-2.2, 1.6, -0.9, 2.4, -1.5, 0.8, -2.6, 1.2];
const TAPE_VARIANTS: TapeVariant[] = [
  "center",
  "left",
  "right",
  "corner-left",
  "center",
  "right",
  "left",
  "center",
];
const TAPE_COLORS = ["#f6d79a", "#f9cdbf", "#cfe5f6", "#f6d79a", "#e9dcc4"];

/** Prints in the same row of four reveal 60ms apart, left to right. */
const REVEAL_STAGGER_MS = 60;
const COLUMNS_FOR_STAGGER = 4;
/** Photos in the first screenful load immediately. */
const EAGER_COUNT = 4;

export function MemoryWall({ photos }: { photos: HappyFamilyPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="memory-wall" aria-label="Photos from TeddyPups families">
        {photos.map((photo, index) => (
          <Reveal
            as="li"
            key={photo.src}
            className="memory-wall__item"
            style={{ "--d": `${(index % COLUMNS_FOR_STAGGER) * REVEAL_STAGGER_MS}ms` } as CSSProperties}
          >
            <button
              type="button"
              className="memory-wall__print"
              aria-label={`Open photo ${index + 1} of ${photos.length}`}
              onClick={() => setOpenIndex(index)}
            >
              <Polaroid
                photo={photo}
                tilt={TILTS[index % TILTS.length]}
                tapeVariant={TAPE_VARIANTS[index % TAPE_VARIANTS.length]}
                tapeColor={TAPE_COLORS[index % TAPE_COLORS.length]}
                eager={index < EAGER_COUNT}
              />
              {/* A paw "pats" the print down when it is revealed. */}
              <PawIcon className="memory-wall__paw" />
            </button>
          </Reveal>
        ))}
      </ul>

      {openIndex !== null && (
        <PhotoViewer
          photos={photos}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
