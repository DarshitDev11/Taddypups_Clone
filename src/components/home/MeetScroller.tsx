"use client";

// Wrapper of the "Meet the pups" scene. From 1024px wide it pins the scene to the screen and turns vertical
// scrolling into sideways travel of the door row, opening each door as it passes Teddy. On narrower screens
// it does nothing: the doors are a plain grid and CSS opens them as they scroll into view.

import { useEffect, useRef, type ReactNode } from "react";

/** Pixels of scrolling per pixel of sideways travel. Above 1 the doors move faster than the page scrolls. */
const SCROLL_SPEED = 1.25;
/** A door counts as "passed" once its centre is left of this share of the screen width. */
const OPEN_LINE = 0.45;
/** Share of the remaining distance covered per frame; gives the glide. */
const CATCH_UP = 0.1;

export function MeetScroller({ children }: { children: ReactNode }) {
  const rangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const range = rangeRef.current;
    const track = range?.querySelector<HTMLElement>("[data-track]");
    if (!range || !track) return;

    const doors = Array.from(track.querySelectorAll<HTMLElement>("[data-door]"));
    const wide = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let travel = 0; // how far the track can move left, in px
    let doorCentres: number[] = []; // each door's centre along the track, in px
    let current = 0; // where the track is now (px, <= 0)
    let frame = 0;

    function unpin() {
      cancelAnimationFrame(frame);
      frame = 0;
      delete range!.dataset.pinned;
      range!.style.removeProperty("height");
      range!.style.removeProperty("--floor-x");
      track!.style.removeProperty("transform");
      for (const door of doors) door.dataset.open = "false";
    }

    /** Where the track should be for the current scroll position. */
    function targetX() {
      const { top, height } = range!.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -top / scrollable)) : 0;
      return -progress * travel;
    }

    function draw() {
      track!.style.transform = `translate3d(${current}px, 0, 0)`;
      // The floor planks slide along with the doors.
      range!.style.setProperty("--floor-x", `${current}px`);
      doors.forEach((door, index) => {
        door.dataset.open = String(doorCentres[index] + current < window.innerWidth * OPEN_LINE);
      });
    }

    function step() {
      const target = targetX();
      current = reducedMotion.matches ? target : current + (target - current) * CATCH_UP;
      draw();
      // Keep animating until the track has caught up with the scroll position.
      frame = Math.abs(target - current) > 0.5 ? requestAnimationFrame(step) : 0;
    }

    function requestStep() {
      if (!frame) frame = requestAnimationFrame(step);
    }

    function measure() {
      if (!wide.matches) {
        unpin();
        return;
      }
      range!.dataset.pinned = "";
      travel = Math.max(0, track!.scrollWidth - window.innerWidth);
      // Section height = one screen (the pinned stage) + the scrolling needed to cover the travel.
      range!.style.height = `${window.innerHeight + travel / SCROLL_SPEED}px`;
      doorCentres = doors.map((door) => door.offsetLeft + door.offsetWidth / 2);
      current = targetX();
      draw();
    }

    measure();
    window.addEventListener("scroll", requestStep, { passive: true });
    window.addEventListener("resize", measure);
    wide.addEventListener("change", measure);

    return () => {
      window.removeEventListener("scroll", requestStep);
      window.removeEventListener("resize", measure);
      wide.removeEventListener("change", measure);
      unpin();
    };
  }, []);

  return (
    <div ref={rangeRef} className="home-meet__range">
      {children}
    </div>
  );
}
