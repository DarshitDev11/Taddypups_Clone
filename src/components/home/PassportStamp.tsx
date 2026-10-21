// A rubber stamp in the passport book: a line icon and a title inside a speckled, slightly crooked outline.

import type { ReactNode } from "react";
import type { StampIcon, StampShape } from "@/components/home/homeContent";

/** Line icons on a 64-unit grid; the stroke colour is the stamp's ink. */
const ICONS: Record<StampIcon, ReactNode> = {
  "heart-pulse": (
    <>
      <path d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z" />
      <path d="M22 30h7l3-7 4 13 3-6h7" />
    </>
  ),
  plane: (
    <>
      <path d="M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-2 10 2 10h-3l-6-7-12-1 6 17h-6L28 37 6 36z" />
      <path d="M8 50c10 4 20 4 30 0" strokeDasharray="2 7" />
    </>
  ),
  chat: (
    <>
      <path d="M10 14h44v28H30l-12 10v-10h-8z" />
      <path d="M22 28h0M32 28h0M42 28h0" strokeWidth="5" />
    </>
  ),
  globe: (
    <>
      <circle cx="32" cy="32" r="22" />
      <path d="M10 32h44M32 10c-8 8-8 36 0 44M32 10c8 8 8 36 0 44" />
    </>
  ),
};

interface PassportStampProps {
  title: string;
  icon: StampIcon;
  shape: StampShape;
}

export function PassportStamp({ title, icon, shape }: PassportStampProps) {
  return (
    <span className={`home-stamp home-stamp--${shape}`}>
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="home-stamp__icon"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[icon]}
      </svg>
      <span className="home-stamp__title font-plush">{title}</span>
    </span>
  );
}
