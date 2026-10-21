// Illustrated postcard beside each way home: the Dubai skyline, or a dotted flight path from abroad.

import { DubaiSkyline } from "@/components/decor/DubaiSkyline";
import type { JourneyKey } from "@/data/howItWorks";

export function Postcard({ journey }: { journey: JourneyKey }) {
  if (journey === "local") {
    return (
      <div aria-hidden="true" className="postcard">
        <span className="postcard__sun" />
        <DubaiSkyline className="postcard__city" />
        <span className="font-scrawl postcard__label postcard__label--top-left">Downtown Dubai</span>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="postcard postcard--sky">
      <svg viewBox="0 0 320 150" preserveAspectRatio="none" className="postcard__route">
        <path d="M28 128C90 20 230 20 292 118" />
      </svg>
      <svg viewBox="0 0 64 40" className="postcard__plane">
        <path
          d="M4 22l20-2 12-14h6l-6 14 14-1 6-7h4l-3 10 3 10h-4l-6-7-14-1 6 14h-6L24 24 4 22z"
          fill="#fffdf8"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-scrawl postcard__label postcard__label--bottom-left">Europe · Korea</span>
      <span className="font-scrawl postcard__label postcard__label--bottom-right">Dubai</span>
    </div>
  );
}
