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

    // Same-page hash links glide instead of jumping (scroll-padding-top in the CSS is not used by Lenis).
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash || url.origin !== window.location.origin) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      const header = document.getElementById("site-header")?.offsetHeight ?? 0;
      lenis.scrollTo(target, { offset: -(header + 16) });
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
