// Handwritten (Shantell Sans) text for kickers, captions and small notes.

import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type Tone = "ink" | "soft" | "inherit";

const TONE_CLASS: Record<Tone, string> = {
  ink: "text-toffee-ink",
  soft: "text-cocoa-soft",
  inherit: "",
};

type HandwrittenLabelProps = ComponentPropsWithoutRef<"p"> & {
  /** Element to render. Default <p>; use "span" inline or "h2" for headings. */
  as?: ElementType;
  /** Colour: toffee-ink (default), cocoa-soft, or inherit from the parent. */
  tone?: Tone;
};

export function HandwrittenLabel({
  as: Tag = "p",
  tone = "ink",
  className,
  ...props
}: HandwrittenLabelProps) {
  return <Tag className={cn("font-scrawl", TONE_CLASS[tone], className)} {...props} />;
}
