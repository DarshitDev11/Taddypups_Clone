// Centred page column: horizontal gutter plus a 110rem max width. Wrap every page section's content in it.

import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  /** Which element to render, so the markup stays semantic. */
  as?: "div" | "section" | "header" | "footer" | "article" | "nav";
};

export function Container({ as: Tag = "div", className, ...props }: ContainerProps) {
  return <Tag className={cn("gutter mx-auto max-w-page", className)} {...props} />;
}
