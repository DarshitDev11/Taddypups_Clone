// Heading block for inner pages: optional handwritten kicker, giant h1, intro paragraph, optional actions.

import type { ReactNode } from "react";
import { HandwrittenLabel } from "@/components/ui/HandwrittenLabel";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  /** Small handwritten line above the title, e.g. "from Teddy's sketchbook". */
  kicker?: string;
  /** Intro paragraph under the title. */
  lede?: ReactNode;
  /** Buttons or links placed under the lede. */
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ title, kicker, lede, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("max-w-4xl", className)}>
      {kicker && <HandwrittenLabel className="text-lg">{kicker}</HandwrittenLabel>}
      <h1 className="font-plush text-giant">{title}</h1>
      {lede && <p className="text-lede mt-6 max-w-[46ch] text-cocoa-soft">{lede}</p>}
      {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
