"use client";

import { useCallback, useEffect, type RefObject } from "react";

/** Past this scroll position the header may hide (px). */
const HIDE_AFTER = 220;
/** Past this scroll position the header gets its milk background (px). */
const SCROLLED_AFTER = 8;
/** Ignore tiny scroll movements so the header doesn't flicker (px). */
const MIN_DELTA = 6;

/**
 * Drives the header's scroll behaviour by writing two data attributes on the element:
 *   data-scrolled="true"  the page has moved down a little (header gets its background)
 *   data-hidden="true"    the user is scrolling down past 220px (header slides away)
 * Scrolling up shows it again.
 *
 * The attributes go straight to the DOM instead of through React state. Scroll events fire
 * constantly and this is pure styling, so it avoids a re-render per event. CSS in
 * styles/shell.css reacts to the attributes.
 *
 * Returns `reveal`, which shows the header again (used when keyboard focus lands inside it).
 */
export function useHeaderScrollState(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    let lastY = window.scrollY;
    let frameRequested = false;

    const update = () => {
      frameRequested = false;
      const y = window.scrollY;
      header.dataset.scrolled = String(y > SCROLLED_AFTER);

      const delta = y - lastY;
      if (Math.abs(delta) > MIN_DELTA) {
        header.dataset.hidden = String(delta > 0 && y > HIDE_AFTER);
        lastY = y;
      }
    };

    // One update per animation frame, however many scroll events arrive.
    const onScroll = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(update);
    };

    update(); // the page may already be scrolled on load (reload, back button)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);

  return useCallback(() => {
    if (ref.current) ref.current.dataset.hidden = "false";
  }, [ref]);
}
