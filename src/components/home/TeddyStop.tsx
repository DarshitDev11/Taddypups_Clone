// A still Teddy standing in one scene. The live mascot (PupActor) walks between these stops.

import { Teddy, type TeddyPose } from "@/components/decor/Teddy";
import { cn } from "@/lib/utils";

interface TeddyStopProps {
  pose: TeddyPose;
  facing?: "left" | "right";
  label?: string;
  /** Sizes and places this stop inside its scene (width, absolute position ...). */
  className?: string;
}

export function TeddyStop({ pose, facing = "right", label, className }: TeddyStopProps) {
  // PupActor (the live Teddy) finds every [data-pup-stop], walks to the nearest one and hides this still copy
  // with [data-pup-active] while it stands there. Without JS Teddy simply stays where the scene puts him.
  return (
    <div data-pup-stop="" data-pose={pose} data-facing={facing} className={cn("home-stop", className)}>
      <Teddy pose={pose} facing={facing} label={label} />
    </div>
  );
}
