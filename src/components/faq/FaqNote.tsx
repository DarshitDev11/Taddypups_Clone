// One pinned question card: tap the question and the folded note opens to show the answer.

import type { CSSProperties } from "react";
import { Highlight } from "@/components/faq/Highlight";
import { Reveal } from "@/components/puppies/Reveal";
import type { Faq } from "@/data/faqs";

// Each note gets a slight tilt and a coloured pin from these cycles (the lists have different lengths,
// so neighbouring notes rarely repeat). Pin colours come from the theme plus two literals.
const TILTS = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.7, -1.9, 1.4];
const PIN_COLORS = ["var(--color-toffee)", "var(--color-sky-deep)", "#d9a13c", "#c45a6a"];

interface FaqNoteProps {
  faq: Faq;
  /** Position in the full list, used for the element ids. */
  index: number;
  /** Position among the notes currently shown: tilt and pin colour follow it, like the original. */
  position: number;
  /** Used to make unique element ids for aria-controls. */
  idBase: string;
  open: boolean;
  query: string;
  onToggle: () => void;
}

export function FaqNote({ faq, index, position, idBase, open, query, onToggle }: FaqNoteProps) {
  const questionId = `${idBase}-q-${index}`;
  const answerId = `${idBase}-a-${index}`;
  const style = {
    "--tilt": `${TILTS[position % TILTS.length]}deg`,
    "--pin": PIN_COLORS[position % PIN_COLORS.length],
    "--i": position,
  } as CSSProperties;

  return (
    <Reveal as="li" className="note" data-unfolded={open || undefined} style={style}>
      <span aria-hidden="true" className="note__pin" />
      <h2 className="note__q">
        <button
          type="button"
          id={questionId}
          aria-expanded={open}
          aria-controls={answerId}
          onClick={onToggle}
        >
          <span className="font-plush-text">
            <Highlight text={faq.question} query={query} />
          </span>
          <span aria-hidden="true" className="note__chevron" />
        </button>
      </h2>
      {/* inert keeps the hidden answer out of the tab order and away from screen readers until it opens. */}
      <div id={answerId} role="region" aria-labelledby={questionId} className="note__answer" inert={!open}>
        <div className="note__flap">
          <p>
            <Highlight text={faq.answer} query={query} />
          </p>
        </div>
      </div>
    </Reveal>
  );
}
