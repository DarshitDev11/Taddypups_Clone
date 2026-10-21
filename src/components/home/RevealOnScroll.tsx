"use client";

// Arms every [data-reveal] element on the page and flips it to data-revealed once it scrolls into view. Renders nothing.
// The CSS only hides an element while it is "armed but not revealed", so without JavaScript everything stays visible.

import { useEffect } from "react";

export function RevealOnScroll() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "true";
          observer.unobserve(entry.target); // reveal once, never hide again
        }
      },
      // A little inset so items pop in when they are properly on screen, not at the very edge.
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );

    for (const item of items) {
      // Already on screen at load: show it straight away instead of hiding and re-showing it.
      const { top, bottom } = item.getBoundingClientRect();
      if (top < window.innerHeight && bottom > 0) {
        item.dataset.revealed = "true";
        continue;
      }
      item.dataset.armed = "true";
      observer.observe(item);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
