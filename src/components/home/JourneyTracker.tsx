"use client";

// Wrapper of the "Your puppy journey" grid. Works out which step the reader has scrolled to and writes it to the DOM
// (data-step on the wrapper, data-state on each step); CSS then lights up the step and reveals the matching chat replies.

import { useEffect, useRef, type ReactNode } from "react";

/** A step becomes the active one when its top passes this share of the screen height. */
const ACTIVE_LINE = 0.38;

export function JourneyTracker({ children, className }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-journey-step]"));
    const wide = window.matchMedia("(min-width: 1024px)");
    let frame = 0;

    function update() {
      frame = 0;
      // 0 = no step reached yet. On narrow screens every step is visible at once, so show the finished state.
      let active = wide.matches ? 0 : steps.length;
      if (wide.matches) {
        steps.forEach((step, index) => {
          if (step.getBoundingClientRect().top <= window.innerHeight * ACTIVE_LINE) active = index + 1;
        });
      }

      root!.dataset.step = String(active);
      steps.forEach((step, index) => {
        const number = index + 1;
        step.dataset.state = number < active ? "done" : number === active ? "active" : "idle";
      });
    }

    function requestUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
