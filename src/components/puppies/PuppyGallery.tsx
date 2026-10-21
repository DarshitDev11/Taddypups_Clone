"use client";

// Gallery on a puppy's page: the big "storybook page" with prev/next, thumbnails, swipe and the full-screen viewer.

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { MediaFrame } from "@/components/puppies/MediaFrame";
import { PhotoLightbox } from "@/components/puppies/PhotoLightbox";
import { SWIPE_THRESHOLD, slideVariants } from "@/components/puppies/slideMotion";
import { focalPosition } from "@/lib/puppies";
import { cn } from "@/lib/utils";
import type { PuppyMedia } from "@/types/puppy";

type PuppyGalleryProps = {
  name: string;
  media: PuppyMedia[];
};

const arrowButtonClass =
  "grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold";

export function PuppyGallery({ name, media }: PuppyGalleryProps) {
  const [index, setIndex] = useState(0);
  // 1 = moved forward, -1 = moved back; tells the slide animation which side to come from.
  const [direction, setDirection] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const justDragged = useRef(false);

  const total = media.length;
  const hasMany = total > 1;

  /** Move by one (wrapping round at both ends). */
  function step(delta: number) {
    setDirection(delta);
    setIndex((current) => (current + delta + total) % total);
  }

  function select(target: number) {
    setDirection(target > index ? 1 : -1);
    setIndex(target);
  }

  const current = media[index];

  return (
    <div>
      <div className="storypage relative aspect-[4/5] md:aspect-[5/6]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            // Swiping sideways changes the photo; a plain tap still opens the viewer.
            drag={hasMany ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragStart={() => {
              justDragged.current = true;
            }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) step(1);
              else if (info.offset.x > SWIPE_THRESHOLD) step(-1);
              setTimeout(() => {
                justDragged.current = false;
              }, 0);
            }}
            className="absolute inset-0"
          >
            <button
              type="button"
              className="absolute inset-0 block size-full"
              aria-label={`Open ${name}, photo ${index + 1} of ${total} full screen`}
              onClick={() => {
                if (!justDragged.current) setLightboxOpen(true);
              }}
            >
              <MediaFrame media={current} sizes="(min-width: 1024px) 55vw, 92vw" preload={index === 0} />
            </button>
          </motion.div>
        </AnimatePresence>

        {hasMany && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex justify-between">
            <button
              type="button"
              className={cn(arrowButtonClass, "pointer-events-auto")}
              aria-label="Previous photo"
              onClick={() => step(-1)}
            >
              ‹
            </button>
            <span className="self-center rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk">
              {index + 1} / {total}
            </span>
            <button
              type="button"
              className={cn(arrowButtonClass, "pointer-events-auto")}
              aria-label="Next photo"
              onClick={() => step(1)}
            >
              ›
            </button>
          </div>
        )}
      </div>

      {hasMany && (
        <ul
          className="mt-3 flex gap-3 overflow-x-auto px-1 pt-2 pb-2 [scrollbar-width:thin]"
          aria-label={`All photos of ${name}`}
        >
          {media.map((item, itemIndex) => {
            const selected = itemIndex === index;
            // A video's thumbnail is its poster frame, with a play triangle on top.
            const thumb = item.kind === "video" ? item.poster : item;
            return (
              <li key={item.src} className="shrink-0">
                <button
                  type="button"
                  aria-label={`${name}, ${item.kind === "video" ? "video" : "photo"} ${itemIndex + 1} of ${total}`}
                  aria-current={selected}
                  onClick={() => select(itemIndex)}
                  className={cn(
                    "relative block h-24 w-20 overflow-hidden rounded-[0.9rem] border-[3px] transition-transform duration-300 md:h-28 md:w-24",
                    selected
                      ? "-translate-y-1 -rotate-3 border-toffee-deep"
                      : "border-cocoa/30 hover:-rotate-2 hover:border-cocoa",
                  )}
                >
                  <Image
                    src={thumb.src}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                    style={{ objectPosition: focalPosition(thumb) }}
                  />
                  {item.kind === "video" && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 grid place-items-center text-milk drop-shadow"
                    >
                      ▶
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <PhotoLightbox
        name={name}
        media={media}
        index={index}
        direction={direction}
        open={lightboxOpen}
        onStep={step}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
