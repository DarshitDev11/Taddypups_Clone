"use client";

// Full-screen viewer for a puppy's photos and videos, built on a native <dialog> with Motion slide animations.

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import { MediaFrame } from "@/components/puppies/MediaFrame";
import { SWIPE_THRESHOLD, slideVariants } from "@/components/puppies/slideMotion";
import type { PuppyMedia } from "@/types/puppy";

type PhotoLightboxProps = {
  name: string;
  media: PuppyMedia[];
  index: number;
  /** 1 = moving forward, -1 = moving back (decides which side the next photo slides in from). */
  direction: number;
  open: boolean;
  onStep: (delta: number) => void;
  onClose: () => void;
};

export function PhotoLightbox({ name, media, index, direction, open, onStep, onClose }: PhotoLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // A swipe ends with a click on the dark area; remember it was a drag so that click doesn't close the viewer.
  const justDragged = useRef(false);
  const current = media[index];

  // The prop drives the dialog: showModal() gives us the backdrop, focus trap and Esc key for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Stop the page behind from scrolling while the viewer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [open]);

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft") onStep(-1);
    if (event.key === "ArrowRight") onStep(1);
  }

  // A click on the dark area (not on the photo or a button) closes the viewer.
  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    if (justDragged.current) return;
    const target = event.target as HTMLElement;
    if (target === event.currentTarget || target.hasAttribute("data-dismiss")) onClose();
  }

  // Esc and form-method close both fire "close"; keep the parent's state in step.
  return (
    <dialog
      ref={dialogRef}
      aria-label={`${name} photos`}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      data-lenis-prevent
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
    >
      {open && (
        <div data-dismiss className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="font-scrawl text-lg" aria-live="polite">
              {name}, photo {index + 1} of {media.length}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa"
            >
              Close
            </button>
          </div>

          <div
            data-dismiss
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
          >
            <AnimatePresence initial={false} custom={direction}>
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
                data-dismiss
                onDragStart={() => {
                  justDragged.current = true;
                }}
                onDragEnd={(_, info) => {
                  setTimeout(() => {
                    justDragged.current = false;
                  }, 0);
                  if (info.offset.x < -SWIPE_THRESHOLD) onStep(1);
                  else if (info.offset.x > SWIPE_THRESHOLD) onStep(-1);
                }}
                className="absolute inset-0 grid place-items-center"
              >
                {/* Sized to fit the screen while keeping the photo's own shape: the 150px is the bars above and below. */}
                <div
                  className="relative"
                  style={{
                    aspectRatio: `${current.width} / ${current.height}`,
                    width: `min(100vw, calc((100dvh - 150px) * ${current.width / current.height}))`,
                  }}
                >
                  <MediaFrame media={current} sizes="100vw" fit="contain" controls />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div data-dismiss className="flex justify-center gap-3 px-4 pt-3 pb-5">
            <button
              type="button"
              onClick={() => onStep(-1)}
              className="h-12 rounded-full border-2 border-milk px-6 font-semibold"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => onStep(1)}
              className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
