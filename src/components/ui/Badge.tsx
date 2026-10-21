// Small pills: <Chip> (honey pill, optional paw) and <VideoPill> ("▶ video" overlay for photos).

import type { ComponentPropsWithoutRef } from "react";
import { PawIcon } from "@/components/decor/icons";
import { cn } from "@/lib/utils";

type ChipProps = ComponentPropsWithoutRef<"span"> & {
  /** Show the toffee paw before the text. */
  paw?: boolean;
};

export function Chip({ paw = false, className, children, ...props }: ChipProps) {
  return (
    <span className={cn("chip", className)} {...props}>
      {paw && <PawIcon className="size-4 text-toffee" />}
      {children}
    </span>
  );
}

/** Dark "video" tag. Position it with className, e.g. "absolute bottom-[9%] left-[9%]". */
export function VideoPill({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "rounded-full bg-cocoa/80 px-2.5 py-0.5 text-[0.74rem] leading-5 font-bold text-milk",
        className,
      )}
      {...props}
    >
      ▶ video
    </span>
  );
}
