// An "admit one" ticket for a puppy that has gone home: round photo, name, route line and a tear-off stub.

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/puppies/Reveal";
import { focalPosition, genderLabels, getCoverImage, hasOwnName } from "@/lib/puppies";
import type { Puppy } from "@/types/puppy";

type TicketProps = {
  puppy: Puppy;
  /** Position in the list: staggers the entrance and picks the tilt. */
  index: number;
};

/** A few fixed tilts, repeated down the grid, so the stack of tickets looks casually dropped. */
const TILTS = [-1.4, 1.1, -0.6, 1.6, -1.1, 0.7, -0.4, 1.3];

export function Ticket({ puppy, index }: TicketProps) {
  const cover = getCoverImage(puppy);
  const gender = genderLabels[puppy.gender];

  // Unnamed puppies are called by their breed already, so the meta line only adds the gender.
  const meta = hasOwnName(puppy) ? `${puppy.breed}, ${gender.toLowerCase()}` : gender;
  const origin = puppy.origin === "local" ? "Dubai showroom" : "TeddyPups";

  const cssVars = { "--tilt": `${TILTS[index % TILTS.length]}deg`, "--i": index } as CSSProperties;

  return (
    <Reveal as="li" className="ticket" style={cssVars}>
      <Link href={`/puppies/${puppy.slug}`} className="ticket__link">
        <span className="ticket__main">
          <span className="ticket__photo">
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="7rem"
              className="object-cover"
              style={{ objectPosition: focalPosition(cover) }}
            />
          </span>
          <span className="ticket__body">
            <span className="font-scrawl ticket__kicker">one ticket home</span>
            <span className="font-plush ticket__name">{puppy.name}</span>
            <span className="ticket__meta">{meta}</span>
            <span className="ticket__route">
              <span>{origin}</span>
              {/* Dotted shaft plus a solid arrowhead: the dash pattern is set in CSS for the first path only. */}
              <svg viewBox="0 0 60 12" aria-hidden="true">
                <path d="M2 6h46" />
                <path d="M44 2l6 4-6 4" />
              </svg>
              <span>home ♥</span>
            </span>
          </span>
        </span>
        <span aria-hidden="true" className="ticket__stub">
          <span className="font-plush">admit one</span>
        </span>
      </Link>
    </Reveal>
  );
}
