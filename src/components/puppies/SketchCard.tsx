// A puppy drawn as a sketchbook page: blob-masked photo, wash colour, wobbly ink outline and doodles.

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { VideoPill } from "@/components/ui/Badge";
import { StatusTag } from "@/components/ui/StatusTag";
import { Reveal } from "@/components/puppies/Reveal";
import { createSketch } from "@/components/puppies/sketchShapes";
import { focalPosition, genderLabels, getCoverImage, hasOwnName } from "@/lib/puppies";
import { cn } from "@/lib/utils";
import type { Puppy } from "@/types/puppy";

type SketchCardProps = {
  puppy: Puppy;
  /** Position in the list: staggers the draw-on so cards animate one after another. */
  index: number;
  /** Smaller version used in the "Already gone home" strip. */
  small?: boolean;
};

/** Hint for next/image: the card is about a quarter of the viewport on desktop, almost half on phones. */
const SKETCH_SIZES = "(min-width: 1536px) 17rem, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw";
const SMALL_SKETCH_SIZES = "9rem";

export function SketchCard({ puppy, index, small = false }: SketchCardProps) {
  const sketch = createSketch(puppy.slug);
  const cover = getCoverImage(puppy);
  const isGone = puppy.status === "gone";
  const gender = genderLabels[puppy.gender].toLowerCase();
  const hasVideo = puppy.media.some((item) => item.kind === "video");

  // "Maltipoo · boy · 3 months", leaving out the breed when it is already the name.
  const meta = [hasOwnName(puppy) ? puppy.breed : null, gender, puppy.age].filter(Boolean).join(" · ");
  const label = `${puppy.name}, ${puppy.breed}, ${gender}, ${puppy.age}, ${isGone ? "gone home" : "available"}`;

  const cssVars = {
    "--tilt": `${sketch.tilt}deg`,
    "--d": `${(index % 8) * 70}ms`,
    "--wash": sketch.washColour,
    "--mask": sketch.maskImage,
  } as CSSProperties;

  return (
    <li>
      <Reveal as="div" className={cn("sketch", small && "sketch--small")} style={cssVars}>
        <Link href={`/puppies/${puppy.slug}`} aria-label={label} className="sketch__link">
          <span className="sketch__frame">
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              className="sketch__wash"
              style={{ translate: `${sketch.washOffset.x}% ${sketch.washOffset.y}%` }}
            >
              <path d={sketch.washPath} />
            </svg>

            <span className="sketch__photo">
              <Image
                src={cover.src}
                alt=""
                fill
                sizes={small ? SMALL_SKETCH_SIZES : SKETCH_SIZES}
                className="object-cover"
                style={{ objectPosition: focalPosition(cover) }}
              />
            </span>

            {/* pathLength=1 lets CSS draw every line with the same dash values, whatever its real length. */}
            <svg aria-hidden="true" viewBox="0 0 100 100" className="sketch__ink">
              <path d={sketch.inkPath} pathLength={1} className="sketch__line" />
              <path d={sketch.retracePath} pathLength={1} className="sketch__line sketch__line--retrace" />
              {sketch.doodles.map((doodle) => (
                <g key={doodle.placement} transform={doodle.placement}>
                  <g className="sketch__doodle">
                    <path
                      d={doodle.d}
                      transform={doodle.shapeTransform}
                      fill={doodle.filled ? doodle.colour : "none"}
                      stroke={doodle.filled ? "none" : doodle.colour}
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.85}
                    />
                  </g>
                </g>
              ))}
            </svg>

            <StatusTag
              status={puppy.status}
              className={cn(
                "sketch__sticker absolute z-[2]",
                isGone
                  ? "-bottom-[0.4rem] left-1/2 -translate-x-1/2 whitespace-nowrap"
                  : "-right-[0.2rem] top-[8%] max-sm:top-[4%]",
              )}
            />
            {hasVideo && !isGone && <VideoPill className="absolute bottom-[9%] left-[9%] z-[2]" />}
          </span>

          <span className="sketch__name font-plush">{puppy.name}</span>
          {!small && <span className="sketch__meta">{meta}</span>}
        </Link>
      </Reveal>
    </li>
  );
}
