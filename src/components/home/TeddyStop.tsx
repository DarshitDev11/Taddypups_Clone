// A still Teddy standing in one scene. The live mascot will walk between these stops later.

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
  // TODO(mascot): the moving actor will find every [data-pup-stop], walk to it while its scene is on
  // screen and hide this still copy. Until then Teddy simply stays where the scene puts him.
  return (
    <div data-pup-stop="" data-pose={pose} data-facing={facing} className={cn("home-stop", className)}>
      <Teddy pose={pose} facing={facing} label={label} />
    </div>
  );
}
