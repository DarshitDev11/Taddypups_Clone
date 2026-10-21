// One photo or video from a puppy's gallery, filling its parent (which must be positioned).

import Image from "next/image";
import { focalPosition } from "@/lib/puppies";
import { cn } from "@/lib/utils";
import type { PuppyMedia } from "@/types/puppy";

type MediaFrameProps = {
  media: PuppyMedia;
  /** next/image `sizes` hint for photos. */
  sizes: string;
  /** "cover" crops to fill (gallery page); "contain" shows everything (lightbox). */
  fit?: "cover" | "contain";
  /** Load this one eagerly (the first photo, which is above the fold). */
  preload?: boolean;
  /** Videos in the lightbox get controls; the small gallery ones just loop silently. */
  controls?: boolean;
  className?: string;
};

export function MediaFrame({
  media,
  sizes,
  fit = "cover",
  preload = false,
  controls = false,
  className,
}: MediaFrameProps) {
  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  if (media.kind === "video") {
    return (
      <video
        src={media.src}
        poster={media.poster.src}
        // Browsers only allow autoplay for muted videos; loop + playsInline keep it from going fullscreen on iOS.
        autoPlay
        muted
        loop
        playsInline
        controls={controls}
        aria-label={media.alt}
        className={cn("size-full", fitClass, className)}
        style={{ objectPosition: focalPosition(media.poster) }}
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      preload={preload}
      className={cn(fitClass, className)}
      style={{ objectPosition: focalPosition(media) }}
    />
  );
}
