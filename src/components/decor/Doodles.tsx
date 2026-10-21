// Little hand-drawn doodles (swirl, motion lines, dots) used to decorate cards and scenes.
// Paw, heart and sparkle doodles are in icons.tsx. All take their colour from `currentColor`.

import type { SVGProps } from "react";

type DoodleProps = SVGProps<SVGSVGElement>;

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SwirlDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...strokeProps} {...props}>
      <path d="M24 24c0-3 4-3 4 0s-6 5-8 0 3-10 10-9 11 9 6 15-14 8-20 2-5-17 4-22" />
    </svg>
  );
}

/** Three short dashes, like the "whoosh" lines next to a moving cartoon. */
export function MotionLinesDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 48 40" aria-hidden="true" {...strokeProps} {...props}>
      <path d="M6 8l14 3M4 20h16M6 32l14-3" />
    </svg>
  );
}

export function DotsDoodle(props: DoodleProps) {
  return (
    <svg viewBox="0 0 40 24" fill="currentColor" aria-hidden="true" {...props}>
      <circle cx="8" cy="16" r="4" />
      <circle cx="22" cy="8" r="3" />
      <circle cx="34" cy="14" r="2.5" />
    </svg>
  );
}
