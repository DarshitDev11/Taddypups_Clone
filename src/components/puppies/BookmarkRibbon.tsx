"use client";

// Toffee bookmark ribbon down the left edge of a puppy page that grows as you read (desktop only).

import { useEffect, useRef } from "react";

/**
 * How far down the page the ribbon is full. 0.75 of the scrollable height matches the original,
 * which reaches a full ribbon a little before the end of the article.
 */
const FULL_AT = 0.75;
/** The ribbon never starts empty, so there is always a little bookmark showing. */
const MIN_SCALE = 0.1;

export function BookmarkRibbon() {
  const bandRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / (scrollable * FULL_AT) : 0;
      const scale = Math.min(1, MIN_SCALE + (1 - MIN_SCALE) * progress);
      // Written straight to the DOM: React would re-render on every scroll tick for no benefit.
      band.style.transform = `scaleY(${scale})`;
    };
    // Scroll events can fire many times per frame; do the work once per frame.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="ribbon">
      <div className="ribbon__track">
        <span ref={bandRef} className="ribbon__band" style={{ transform: `scaleY(${MIN_SCALE})` }} />
      </div>
    </div>
  );
}
