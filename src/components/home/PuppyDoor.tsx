// One arched door in "Meet the pups": the name above, a painted door that swings open to show the puppy's photo.

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PawIcon } from "@/components/decor/icons";
import { StatusTag } from "@/components/ui/StatusTag";
import { focalPosition, genderLabels, getCoverImage, hasOwnName } from "@/lib/puppies";
import type { Puppy } from "@/types/puppy";

/** "Maltipoo, boy, 3 months, with video". The breed is left out when the name already says it. */
function describePuppy(puppy: Puppy): string {
  const hasVideo = puppy.media.some((item) => item.kind === "video");
  return [
    hasOwnName(puppy) ? puppy.breed : null,
    genderLabels[puppy.gender].toLowerCase(),
    puppy.age,
    hasVideo ? "with video" : null,
  ]
    .filter(Boolean)
    .join(", ");
}

interface PuppyDoorProps {
  puppy: Puppy;
  /** Paint colour of the door leaf. */
  colour: string;
}

export function PuppyDoor({ puppy, colour }: PuppyDoorProps) {
  const cover = getCoverImage(puppy);

  return (
    // data-open is only written by MeetScroller (pinned layout); elsewhere CSS opens the door while it scrolls into view.
    <li className="home-door" data-door="" data-open="false" style={{ "--door": colour } as CSSProperties}>
      <Link href={`/puppies/${puppy.slug}`} className="home-door__link">
        <span className="home-door__plate">
          <span className="home-door__name font-plush">{puppy.name}</span>
          <span className="home-door__meta">{describePuppy(puppy)}</span>
        </span>
        <span className="home-door__frame">
          <span className="home-door__way">
            {/* The room behind the door: the puppy's photo. */}
            <span className="home-door__room">
              <Image
                src={cover.src}
                alt={cover.alt}
                fill
                sizes="(min-width: 1024px) 16rem, (min-width: 640px) 30vw, 90vw"
                style={{ objectFit: "cover", objectPosition: focalPosition(cover), backgroundColor: cover.color }}
              />
            </span>
            <span className="home-door__leaf">
              <PawIcon className="home-door__peephole" />
              <span className="home-door__knob" />
            </span>
          </span>
          <StatusTag status="available" className="absolute top-[16%] -right-[0.7rem] z-[2]" />
        </span>
      </Link>
    </li>
  );
}
