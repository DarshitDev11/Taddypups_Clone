// Line drawing of the Dubai skyline (Burj Khalifa in the middle), used behind cards and postcards.

import type { SVGProps } from "react";

/** Takes its colour from `currentColor`; size and position come from the className. */
export function DubaiSkyline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 300 120" aria-hidden="true" {...props}>
      <path
        d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
