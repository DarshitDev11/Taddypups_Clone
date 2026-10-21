// Full-screen photo viewer (a native <dialog>) with keyboard, swipe and spring-animated slides.

"use client";

import { AnimatePresence, MotionConfig, motion, type PanInfo, type Variants } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import type { HappyFamilyPhoto } from "@/types/happyFamily";

interface PhotoViewerProps {
  photos: HappyFamilyPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

/** A horizontal drag further than this many pixels counts as a swipe. */
const SWIPE_THRESHOLD = 80;

// The photo flies in from the side we are moving towards, tilted and slightly small, and settles with a
// spring. It leaves quickly the other way. `direction` is +1 for "next" and -1 for "previous".
const slideVariants: Variants = {
  enter: (direction: number) => ({ x: direction * 70, rotate: direction * 5, scale: 0.92, opacity: 0 }),
  center: {
    x: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 26 },
  },
  exit: (direction: number) => ({
    x: direction * -70,
    rotate: direction * -5,
    scale: 0.92,
    opacity: 0,
    transition: { duration: 0.22 },
  }),
};

export function PhotoViewer({ photos, index, onIndexChange, onClose }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [direction, setDirection] = useState(1);
  const count = photos.length;
  const photo = photos[index];

  // showModal() gives us the focus trap, the Esc key and the backdrop for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const go = useCallback(
    (step: 1 | -1) => {
      setDirection(step);
      onIndexChange((index + step + count) % count); // wraps around at both ends
    },
    [index, count, onIndexChange],
  );

  const closeDialog = () => dialogRef.current?.close(); // fires the "close" event handled below

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) go(1);
    else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
  };

  // Clicking the empty space around the photo closes the viewer.
  const handleStageClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) closeDialog();
  };

  const neighbours = [photos[(index + 1) % count], photos[(index - 1 + count) % count]];

  return (
    <dialog
      ref={dialogRef}
      aria-label="Photo viewer"
      data-lenis-prevent
      className="photo-viewer m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
      onKeyDown={handleKeyDown}
      onClose={onClose}
    >
      <MotionConfig reducedMotion="user">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="font-scrawl text-lg" aria-live="polite">
              {index + 1} / {count}
            </p>
            <button
              type="button"
              onClick={closeDialog}
              className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa"
            >
              Close
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden" onClick={handleStageClick}>
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
                className="photo-viewer__slide"
                // Fit the photo inside the viewport: as wide as the screen, or as tall as the space left
                // after the top bar and buttons (about 150px), whichever is smaller.
                style={{ aspectRatio: `${photo.width} / ${photo.height}`, ["--ar" as string]: photo.width / photo.height }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="100vw"
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3 pt-2 pb-5">
            <button
              type="button"
              onClick={() => go(-1)}
              className="h-12 rounded-full border-2 border-milk px-6 font-semibold"
            >
              Previous
            </button>
            <button type="button" onClick={() => go(1)} className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa">
              Next
            </button>
          </div>
        </div>

        {/* Load the next and previous photos in advance so arrows feel instant. */}
        <div className="sr-only" aria-hidden="true">
          {neighbours.map((neighbour) => (
            <Image
              key={neighbour.src}
              src={neighbour.src}
              alt=""
              width={neighbour.width}
              height={neighbour.height}
              sizes="100vw"
              loading="eager"
            />
          ))}
        </div>
      </MotionConfig>
    </dialog>
  );
}
