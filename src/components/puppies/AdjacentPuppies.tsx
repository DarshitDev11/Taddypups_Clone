// "Previous pup / Next pup" cards at the bottom of a puppy page.

import Image from "next/image";
import Link from "next/link";
import { focalPosition, getAdjacentPuppies, getCoverImage } from "@/lib/puppies";
import type { Puppy } from "@/types/puppy";

type AdjacentPuppiesProps = {
  puppy: Puppy;
};

function PupLink({ puppy, label }: { puppy: Puppy; label: string }) {
  const cover = getCoverImage(puppy);
  return (
    <Link
      href={`/puppies/${puppy.slug}`}
      className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 sm:last:flex-row-reverse sm:last:text-right"
    >
      <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="80px"
          className="object-cover"
          style={{ objectPosition: focalPosition(cover) }}
        />
      </span>
      <span>
        <span className="font-scrawl block text-sm text-cocoa-soft">{label}</span>
        <span className="font-plush text-[1.6rem]">{puppy.name}</span>
      </span>
    </Link>
  );
}

export function AdjacentPuppies({ puppy }: AdjacentPuppiesProps) {
  const { previous, next } = getAdjacentPuppies(puppy);

  return (
    <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2">
      <PupLink puppy={previous} label="Previous pup" />
      <PupLink puppy={next} label="Next pup" />
    </nav>
  );
}
