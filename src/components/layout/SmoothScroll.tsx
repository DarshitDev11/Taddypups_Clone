"use client";

// Lenis smooth scrolling. Only for real mouse pointers; touch devices and people who prefer
// reduced motion keep the browser's native scrolling. Renders nothing.

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const isMousePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isMousePointer || prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.1, // how quickly the page catches up with the wheel (lower = floatier)
      wheelMultiplier: 0.85, // slightly slower wheel than the browser default
      // Dialogs (mobile menu, lightboxes) scroll natively.
      prevent: (node) => node.closest("dialog, [data-lenis-prevent]") !== null,
    });

    // Lenis needs to be told when to update: once per animation frame.
    let frame = requestAnimationFrame(function tick(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
