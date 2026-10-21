// Storybook chapter marker on a puppy page: a hand-drawn numbered blob and a short handwritten title.

import type { ReactNode } from "react";

type ChapterLabelProps = {
  number: number;
  children: ReactNode;
};

export function ChapterLabel({ number, children }: ChapterLabelProps) {
  return (
    <p className="chapter">
      <span aria-hidden="true" className="chapter__number font-plush">
        {number}
      </span>
      <span className="font-scrawl">{children}</span>
    </p>
  );
}
