// Marks every [data-reveal] element inside a container as revealed once it scrolls into view.

import { useEffect, type RefObject } from "react";

/**
 * Elements start fully visible (so no-JS and above-the-fold content never flash). Only elements that are
 * below the fold when the page mounts get `data-armed` (CSS hides them) and then `data-revealed` when they
 * scroll into view, which plays the entrance animation. The attributes are written straight to the DOM,
 * like useHeaderScrollState, so revealing never causes a React re-render.
 */
export function useScrollReveal(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = container.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "true";
          observer.unobserve(entry.target);
        }
      },
      // Slightly inside the viewport so the animation is seen, not played just off-screen.
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );

    for (const target of targets) {
      const { top, bottom } = target.getBoundingClientRect();
      const alreadyVisible = top < window.innerHeight * 0.94 && bottom > 0;
      if (alreadyVisible) {
        target.dataset.revealed = "true";
      } else {
        target.dataset.armed = "true";
        observer.observe(target);
      }
    }

    return () => observer.disconnect();
  }, [containerRef]);
}
