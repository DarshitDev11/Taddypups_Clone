// Full-width page band for the inner pages: a custom sky gradient and a light or dark text tone.

import type { CSSProperties, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type InnerSceneProps = ComponentPropsWithoutRef<"section"> & {
  /** Gradient colours, top to bottom. */
  sky: readonly [top: string, bottom: string];
  /** "dark" flips text to milk and inverts the ghost buttons (see `.scene` in components.css). */
  tone?: "light" | "dark";
};

/** Same `.scene` look as the home sections (ui/Section.tsx), but with colours the inner pages choose. */
export function InnerScene({ sky, tone = "light", className, style, ...props }: InnerSceneProps) {
  const vars = { "--sky-top": sky[0], "--sky-bottom": sky[1] } as CSSProperties;
  return <section data-tone={tone} className={cn("scene", className)} style={{ ...vars, ...style }} {...props} />;
}
