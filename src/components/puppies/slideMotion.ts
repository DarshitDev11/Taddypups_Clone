// Shared Motion settings for sliding photos in the gallery and the lightbox.

import type { Variants } from "motion/react";

/** Distance (px) a swipe must travel to count as "next" or "previous". */
export const SWIPE_THRESHOLD = 80;

/**
 * `direction` is 1 when moving forward and -1 when moving back. The new photo arrives from that side,
 * slightly tilted and small, and settles with a spring; the old one leaves the other way, quickly.
 */
export const slideVariants: Variants = {
  enter: (direction: number) => ({ x: direction * 70, rotate: direction * 5, scale: 0.92, opacity: 0 }),
  center: {
    x: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 26 },
  },
  exit: (direction: number) => ({
    x: direction * -70,
    rotate: direction * -5,
    scale: 0.92,
    opacity: 0,
    transition: { duration: 0.22 },
  }),
};
