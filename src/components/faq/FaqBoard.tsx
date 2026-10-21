// The FAQ corkboard: a search box with Teddy on the side and the pinned question notes.

"use client";

import { useId, useState } from "react";
import { Teddy } from "@/components/decor/Teddy";
import { FaqNote } from "@/components/faq/FaqNote";
import { Button } from "@/components/ui/Button";
import type { Faq } from "@/data/faqs";
import { buildWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";

const askLink = buildWhatsAppLink(whatsappMessages.question);

/** Notes whose question or answer contains the text (case-insensitive). An empty search matches all. */
function matchingIndexes(faqs: Faq[], query: string): number[] {
  const needle = query.trim().toLowerCase();
  const indexes: number[] = [];
  faqs.forEach((faq, index) => {
    if (!needle || `${faq.question} ${faq.answer}`.toLowerCase().includes(needle)) indexes.push(index);
  });
  return indexes;
}

export function FaqBoard({ faqs }: { faqs: Faq[] }) {
  const idBase = useId();
  const [query, setQuery] = useState("");
  // Indexes of the unfolded notes. Normally at most one; while searching, every match starts open.
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const searching = query.trim() !== "";
  const visible = matchingIndexes(faqs, query);
  const anyOpen = visible.some((index) => openIndexes.includes(index));

  function handleSearch(value: string) {
    setQuery(value);
    // Open all matches so the highlighted words are visible straight away; clearing the search closes them.
    setOpenIndexes(value.trim() ? matchingIndexes(faqs, value) : []);
  }

  function toggle(index: number) {
    setOpenIndexes((current) => {
      if (current.includes(index)) return current.filter((i) => i !== index);
      // One at a time when browsing; several can stay open while searching.
      return searching ? [...current, index] : [index];
    });
  }

  const count =
    visible.length === 0
      ? "No notes found"
      : searching
        ? `${visible.length} ${visible.length === 1 ? "note" : "notes"} found`
        : `${faqs.length} notes on the board`;

  return (
    <div className="notes">
      <aside className="notes__side" aria-label="Find a question">
        <label htmlFor={`${idBase}-search`} className="font-scrawl notes__label">
          sniff out a question
        </label>
        <div className="notes__search">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="notes__lens">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
          </svg>
          <input
            id={`${idBase}-search`}
            type="search"
            placeholder="delivery, Korea, vaccinated…"
            autoComplete="off"
            value={query}
            onChange={(event) => handleSearch(event.target.value)}
          />
        </div>
        <p className="notes__count" aria-live="polite">
          {count}
        </p>

        <div className="notes__teddy">
          {/* Thought bubble: "?" while idle, "!" once a note is open. */}
          <span aria-hidden="true" className="notes__bubble font-plush" data-open={anyOpen || undefined}>
            <span className="notes__bubble-q">?</span>
            <span className="notes__bubble-a">!</span>
          </span>
          <Teddy pose="sit" facing="right" />
        </div>

        <Button variant="whatsapp" href={askLink} className="notes__ask">
          Ask your own question
        </Button>
      </aside>

      <div className="notes__board">
        {visible.length > 0 ? (
          <ul className="notes__list">
            {visible.map((index, position) => (
              <FaqNote
                key={faqs[index].question}
                faq={faqs[index]}
                index={index}
                position={position}
                idBase={idBase}
                open={openIndexes.includes(index)}
                query={query}
                onToggle={() => toggle(index)}
              />
            ))}
          </ul>
        ) : (
          <div className="note note--empty">
            <span aria-hidden="true" className="note__pin" />
            <p className="font-plush-text text-lg font-bold">
              Nothing pinned about &ldquo;{query.trim()}&rdquo; yet.
            </p>
            <p className="mt-2 text-cocoa-soft">Try another word, or ask us your question on WhatsApp.</p>
          </div>
        )}
      </div>
    </div>
  );
}
