// Top of /puppies: handwritten kicker, giant title with a hand-drawn underline, intro and Teddy's self-portrait.

import { Teddy } from "@/components/decor/Teddy";
import { Reveal } from "@/components/puppies/Reveal";

export function SketchbookHead() {
  return (
    <div className="sketchbook__head">
      <div className="sketchbook__words">
        <Reveal as="p" className="font-scrawl text-lg text-toffee-ink">
          from Teddy&apos;s sketchbook
        </Reveal>

        <Reveal as="h1" id="pups-title" className="font-plush text-giant sketchbook__title">
          Available puppies
          {/* The underline is one stroke; CSS draws it on by animating stroke-dashoffset (pathLength=1). */}
          <svg
            aria-hidden="true"
            viewBox="0 0 400 24"
            preserveAspectRatio="none"
            className="sketchbook__underline"
          >
            <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" pathLength={1} />
          </svg>
        </Reveal>

        <Reveal as="p" className="sketchbook__lede text-lede mt-6 max-w-[46ch] text-cocoa-soft">
          Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us
          about them on WhatsApp.
        </Reveal>
      </div>

      <Reveal className="sketchbook__self">
        <Teddy pose="sit" facing="left" label="Teddy, the TeddyPups puppy" />
        <span className="font-scrawl sketchbook__caption">self-portrait</span>
      </Reveal>
    </div>
  );
}
