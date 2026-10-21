// Availability label for a puppy: "Available" / "gone home ♥" as a tilted sticker, a chip or a rubber stamp.

import { Chip } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { PuppyStatus } from "@/types/puppy";

type StatusTagProps = {
  status: PuppyStatus;
  /**
   * sticker: tilted label on cards (position it with className).
   * chip: honey pill on the detail page.
   * stamp: big outlined stamp for puppies that have gone home (detail page).
   */
  variant?: "sticker" | "chip" | "stamp";
  className?: string;
};

export function StatusTag({ status, variant = "sticker", className }: StatusTagProps) {
  const isGone = status === "gone";

  if (variant === "chip") {
    return (
      <Chip paw={!isGone} className={className}>
        {isGone ? "Gone home" : "Available"}
      </Chip>
    );
  }

  if (variant === "stamp") {
    return (
      <span
        className={cn(
          "stamp-thump font-scrawl inline-grid -rotate-6 rounded-full border-[3px] border-current px-3 py-1 text-sm tracking-wide text-toffee-deep uppercase",
          className,
        )}
      >
        Gone home ♥
      </span>
    );
  }

  return (
    <span
      className={cn(
        "font-scrawl inline-block rounded-full border-2 bg-milk shadow-[2px_3px_rgb(42_23_14/0.2)]",
        isGone
          ? "-rotate-6 border-toffee-deep px-2.5 pt-px pb-0.5 text-[0.78rem] text-toffee-deep"
          : "rotate-[7deg] border-cocoa px-2.5 pt-px pb-0.5 text-[0.9rem]",
        className,
      )}
    >
      {isGone ? "gone home ♥" : "Available"}
    </span>
  );
}
