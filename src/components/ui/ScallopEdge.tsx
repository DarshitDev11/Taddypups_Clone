// Scalloped (cloud-like) edge drawn with a repeating SVG pattern; used on the hero quilt and the page curtain.

import { useId } from "react";
import { cn } from "@/lib/utils";

type ScallopEdgeProps = {
  /** Fill of the scallops, any CSS colour, e.g. "var(--color-honey-soft)". */
  fill: string;
  /** Draw it upside down, for an edge that hangs from the bottom of a block. */
  flip?: boolean;
  className?: string;
};

/**
 * 100% wide, 40px tall. The caller positions it, e.g. "absolute inset-x-0 -top-[39px]"
 * to sit on top of the block it belongs to (the 1px overlap hides the seam).
 */
export function ScallopEdge({ fill, flip = false, className }: ScallopEdgeProps) {
  // Each edge needs its own pattern id, or two edges on one page would share a fill colour.
  const patternId = useId();

  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="40"
      preserveAspectRatio="none"
      className={cn("block", flip && "-scale-y-100", className)}
    >
      <defs>
        <pattern id={patternId} width="76" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 40V27A38 25 0 0 1 76 27V40Z" fill={fill} />
          {/* Cocoa outline of the bump, then a dashed "stitch" line inside it. */}
          <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
          <path
            d="M11 33A27 19 0 0 1 65 33"
            fill="none"
            stroke="#2a170e"
            strokeWidth="1.6"
            strokeDasharray="3.5 5.5"
            strokeLinecap="round"
            opacity=".42"
          />
        </pattern>
      </defs>
      <rect width="100%" height="40" fill={`url(#${patternId})`} />
    </svg>
  );
}
