// A home-page "scene": a full-width band with a sky gradient that moves from morning to night.

import type { CSSProperties, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** Sky gradient (top, bottom) and text tone for every scene. From DESIGN-SPEC 2.1. */
const SCENES = {
  hero: { top: "#fffdf8", bottom: "#fff1d8", tone: "light" },
  meet: { top: "#fff1d8", bottom: "#fbe3b4", tone: "light" },
  paths: { top: "#fbe3b4", bottom: "#f7d18d", tone: "light" },
  chat: { top: "#f7d18d", bottom: "#f0b866", tone: "light" },
  passport: { top: "#f0b866", bottom: "#a65a30", tone: "light" },
  dusk: { top: "#a65a30", bottom: "#4d2b19", tone: "dark" },
  night: { top: "#4d2b19", bottom: "#2f1a10", tone: "dark" },
  home: { top: "#2f1a10", bottom: "#24130b", tone: "dark" },
} as const;

export type SceneName = keyof typeof SCENES;

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  scene: SceneName;
};

export function Section({ scene, className, style, ...props }: SectionProps) {
  const { top, bottom, tone } = SCENES[scene];
  // Custom properties aren't in React's CSSProperties type, hence the cast.
  const sky = { "--sky-top": top, "--sky-bottom": bottom } as CSSProperties;

  return (
    <section data-tone={tone} style={{ ...sky, ...style }} className={cn("scene", className)} {...props} />
  );
}
