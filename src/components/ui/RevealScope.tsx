// Client wrapper that turns on scroll-reveal for every [data-reveal] element inside it.

"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/** Wrap a page section so its server-rendered children can opt in with a `data-reveal` attribute. */
export function RevealScope(props: ComponentPropsWithoutRef<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);
  return <div ref={ref} {...props} />;
}
