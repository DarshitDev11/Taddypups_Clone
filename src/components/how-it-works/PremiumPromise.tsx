// "Our premium puppy promise": a passport page with three rubber stamps.

import type { CSSProperties } from "react";
import { LineIcon } from "@/components/how-it-works/HowItWorksIcons";
import { promiseStamps } from "@/data/howItWorks";

export function PremiumPromise() {
  return (
    <section id="promise" aria-labelledby="promise-title" className="paper mt-24 -rotate-[0.6deg]">
      <p aria-hidden="true" className="font-scrawl text-lg text-toffee-ink">
        puppy passport
      </p>
      <h2 id="promise-title" className="font-plush text-huge mt-1 max-w-[16ch]">
        Our premium puppy promise
      </h2>

      <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {promiseStamps.map((stamp, index) => (
          <li
            key={stamp.title}
            className="promise-entry"
            // --i staggers the "stamp lands" animation from one stamp to the next.
            style={{ "--ink-stamp": stamp.ink, "--tilt": `${stamp.tilt}deg`, "--i": index } as CSSProperties}
          >
            <span className={`stamp stamp--${stamp.shape}`}>
              <LineIcon name={stamp.icon} className="stamp__icon" />
              <span className="stamp__title font-plush">{stamp.title}</span>
            </span>
            <p className="promise-entry__text">{stamp.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
