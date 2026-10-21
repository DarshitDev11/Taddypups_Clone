// Illustrations for the "post my letter" animation: a sealed envelope and a mailbox with a flag.

import { cn } from "@/lib/utils";

const INK = "#2a170e";

/** Envelope whose flap closes when it appears (the flap animation lives in contact.css). */
export function Envelope({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 176 124" aria-hidden="true" className={cn("overflow-visible", className)}>
      <rect x="4" y="16" width="168" height="104" rx="10" fill="#fff8ea" stroke={INK} strokeWidth="3.4" />
      <path
        d="M8 114 88 62l80 52"
        fill="none"
        stroke={INK}
        strokeOpacity="0.45"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <g className="post__flap">
        <path d="M6 20h164L88 76z" fill="#fbe3b4" stroke={INK} strokeWidth="3.4" strokeLinejoin="round" />
        {/* A little heart seal at the tip of the flap. */}
        <path
          d="M88 83c-6-4-9-7-9-10a4 4 0 0 1 9-1 4 4 0 0 1 9 1c0 3-3 6-9 10z"
          fill="#a24a1a"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/** Post-box on a pole. The flag starts folded down and flips up once a letter has been posted. */
export function Mailbox({ className, flagUp = false }: { className?: string; flagUp?: boolean }) {
  return (
    <svg viewBox="0 0 208 250" aria-hidden="true" className={cn("overflow-visible", className)}>
      <rect x="92" y="150" width="24" height="94" rx="4" fill="#d38f45" stroke={INK} strokeWidth="3.4" />
      <path d="M72 244h64" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
      {/* The flag: a pole and a red banner, rotated around its bottom-left corner. */}
      <g className={cn("post__flag", flagUp && "post__flag--up")}>
        <path d="M178 96V40" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M178 40h24v18h-24z" fill="#c45a6a" stroke={INK} strokeWidth="3.4" strokeLinejoin="round" />
      </g>
      <path
        d="M30 150V86a74 62 0 0 1 148 0v64z"
        fill="#a24a1a"
        stroke={INK}
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <rect x="64" y="104" width="80" height="12" rx="6" fill={INK} />
      <path d="M44 150V90" stroke="#fff" strokeOpacity="0.25" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
