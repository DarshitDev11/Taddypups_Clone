"use client";

// Wrapper that plays a "draw on / pop in" entrance once, when the element first scrolls into view.

import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType } from "react";

type RevealProps = ComponentPropsWithoutRef<"div"> & {
  /** Element to render, so lists and links keep their semantics. */
  as?: ElementType;
};

/**
 * State lives in data attributes written straight to the DOM (no React state, so no re-render):
 *   no attributes  -> server HTML and no-JS visitors see the finished state
 *   data-armed     -> JS has taken over: CSS may hide the element, ready for its entrance
 *   data-revealed  -> the entrance plays (CSS transitions do the drawing)
 * Elements already on screen at mount are revealed straight away by the observer's first callback.
 */
export function Reveal({ as: Tag = "div", ...props }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.setAttribute("data-armed", "");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.setAttribute("data-revealed", "true");
        observer.disconnect();
      },
      // Fire a little before the element reaches the bottom edge so the draw-on is seen.
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return <Tag ref={ref} data-reveal="true" {...props} />;
}
