// A torn strip of translucent masking tape that holds a polaroid or poster to the wall.

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type TapeVariant = "center" | "left" | "right" | "corner-left" | "corner-right";

interface MaskingTapeProps {
  variant?: TapeVariant;
  /** Tape colour; the CSS blends it 78% with the paper behind it. */
  color?: string;
  className?: string;
}

export function MaskingTape({ variant = "center", color, className }: MaskingTapeProps) {
  // --tape is a custom property, which React's CSSProperties type doesn't know about.
  const style = color ? ({ "--tape": color } as CSSProperties) : undefined;
  return (
    <span
      aria-hidden="true"
      className={cn("masking-tape", `masking-tape--${variant}`, className)}
      style={style}
    />
  );
}
