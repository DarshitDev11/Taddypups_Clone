// Line icons for the step cards (48-box) and for the promise stamps and "why us" list (64-box).

import type { ReactNode, SVGProps } from "react";
import type { StepIconName } from "@/data/howItWorks";

const LINE = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Step-card icons are drawn with a 2.6 stroke. */
const STEP_ICONS: Record<StepIconName, ReactNode> = {
  "search-heart": (
    <>
      <circle cx="21" cy="21" r="12" {...LINE} strokeWidth="2.6" />
      <path d="m30 30 10 10" {...LINE} strokeWidth="2.6" />
      <path
        d="M21 27c-3-2-4.4-3.6-4.4-5.2a2.2 2.2 0 0 1 4.4-.4 2.2 2.2 0 0 1 4.4.4c0 1.6-1.4 3.2-4.4 5.2z"
        fill="currentColor"
      />
    </>
  ),
  "heart-check": (
    <>
      <path
        d="M24 40C11 31 6 24.5 6 17.8 6 12.4 10.2 8 15.4 8c3.7 0 6.8 2.1 8.6 5.3C25.8 10.1 28.9 8 32.6 8 37.8 8 42 12.4 42 17.8 42 24.5 37 31 24 40z"
        {...LINE}
        strokeWidth="2.6"
      />
      <path d="m17 22 5 5 9-10" {...LINE} strokeWidth="2.6" />
    </>
  ),
  "puppy-face": (
    <>
      <path d="M14 18c-3-6-1-10 3-10s5 4 4 8M34 18c3-6 1-10-3-10s-5 4-4 8" {...LINE} strokeWidth="2.6" />
      <ellipse cx="24" cy="27" rx="13" ry="12" {...LINE} strokeWidth="2.6" />
      <circle cx="19.5" cy="25" r="1.6" fill="currentColor" />
      <circle cx="28.5" cy="25" r="1.6" fill="currentColor" />
      <path
        d="M22 31h4l-2 2z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  truck: (
    <>
      <path d="M5 30V18h22v12M27 22h8l6 6v2H27" {...LINE} strokeWidth="2.6" />
      <path d="M5 30h36" {...LINE} strokeWidth="2.6" />
      <circle cx="13" cy="33" r="3.4" {...LINE} strokeWidth="2.6" />
      <circle cx="34" cy="33" r="3.4" {...LINE} strokeWidth="2.6" />
      <path
        d="M16 26c-2.3-1.6-3.4-2.8-3.4-4a1.7 1.7 0 0 1 3.4-.4 1.7 1.7 0 0 1 3.4.4c0 1.2-1.1 2.4-3.4 4z"
        fill="currentColor"
      />
    </>
  ),
  "calendar-check": (
    <>
      <rect x="7" y="10" width="34" height="30" rx="5" {...LINE} strokeWidth="2.6" />
      <path d="M7 19h34M16 6v8M32 6v8" {...LINE} strokeWidth="2.6" />
      <path d="m17 29 5 5 9-9" {...LINE} strokeWidth="2.6" />
    </>
  ),
  "chat-bubbles": (
    <>
      <path
        d="M6 12a5 5 0 0 1 5-5h16a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-9l-6 5v-5h-1a5 5 0 0 1-5-5z"
        {...LINE}
        strokeWidth="2.6"
      />
      <path
        d="M36 17h1a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-1v5l-6-5h-6a5 5 0 0 1-4-2"
        {...LINE}
        strokeWidth="2.6"
      />
    </>
  ),
  plane: (
    // Mirrored so the plane flies towards the right.
    <path
      transform="matrix(-1 0 0 1 48 0)"
      d="M4 27l13-1.5 8-10h4l-4 9.5 9-.8 4-4.7h3l-2 6.6 2 6.6h-3l-4-4.7-9-.8 4 9.5h-4l-8-10L4 29z"
      {...LINE}
      strokeWidth="2.6"
    />
  ),
  "house-heart": (
    <>
      <path d="M6 23 24 8l18 15M11 19v21h26V19" {...LINE} strokeWidth="2.6" />
      <path
        d="M24 35c-4.6-3.2-6.8-5.7-6.8-8.2a3.4 3.4 0 0 1 6.8-.8 3.4 3.4 0 0 1 6.8.8c0 2.5-2.2 5-6.8 8.2z"
        fill="currentColor"
      />
    </>
  ),
};

export function StepIcon({ name }: { name: StepIconName }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      {STEP_ICONS[name]}
    </svg>
  );
}

type Icon64Props = SVGProps<SVGSVGElement>;

function Icon64({ children, ...props }: Icon64Props) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function HeartPulseIcon(props: Icon64Props) {
  return (
    <Icon64 {...props}>
      <path
        d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z"
        {...LINE}
        strokeWidth="3"
      />
      <path d="M22 30h7l3-7 4 13 3-6h7" {...LINE} strokeWidth="3" />
    </Icon64>
  );
}

/** Plane with a dotted trail behind it. */
export function PlaneTrailIcon(props: Icon64Props) {
  return (
    <Icon64 {...props}>
      <path
        d="M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-2 10 2 10h-3l-6-7-12-1 6 17h-6L28 37 6 36z"
        {...LINE}
        strokeWidth="3"
      />
      <path d="M8 50c10 4 20 4 30 0" {...LINE} strokeWidth="3" strokeDasharray="2 7" />
    </Icon64>
  );
}

export function ChatDotsIcon(props: Icon64Props) {
  return (
    <Icon64 {...props}>
      <path d="M10 14h44v28H30l-12 10v-10h-8z" {...LINE} strokeWidth="3" />
      <path d="M22 28h0M32 28h0M42 28h0" {...LINE} strokeWidth="5" />
    </Icon64>
  );
}

/** Looks an icon up by the name used in data/howItWorks.ts. */
export function LineIcon({ name, ...props }: { name: "heart-pulse" | "plane" | "chat-dots" } & Icon64Props) {
  if (name === "heart-pulse") return <HeartPulseIcon {...props} />;
  if (name === "plane") return <PlaneTrailIcon {...props} />;
  return <ChatDotsIcon {...props} />;
}
