// "Two ways home": a tab switch between meeting a local puppy and ordering an imported one.

"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Teddy } from "@/components/decor/Teddy";
import { StepIcon } from "@/components/how-it-works/HowItWorksIcons";
import { Postcard } from "@/components/how-it-works/Postcard";
import type { Journey, JourneyKey } from "@/data/howItWorks";

/** Soft background colours of the four step icons, in order. */
const STEP_TINTS = ["#fbe3b4", "#fde6de", "#e3f0fb", "#e6f2df"];

export function WaysHome({ journeys }: { journeys: Journey[] }) {
  const [active, setActive] = useState<JourneyKey>(journeys[0].key);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeIndex = journeys.findIndex((journey) => journey.key === active);

  /** Arrow keys, Home and End move between tabs (the ARIA tabs pattern). */
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = journeys.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (activeIndex + 1) % journeys.length
        : event.key === "ArrowLeft"
          ? (activeIndex + last) % journeys.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setActive(journeys[next].key);
    tabRefs.current[journeys[next].key]?.focus();
  }

  return (
    <section className="journeys" aria-labelledby="two-ways-title">
      <div className="journeys__top">
        <div>
          <p className="font-scrawl journeys__kicker">choose your way</p>
          <h2 id="two-ways-title" className="font-plush text-big">
            Two ways home
          </h2>
        </div>

        <div className="journeys__pick">
          {/* --at is the selected tab number: it slides the coloured thumb under the right tab. */}
          <div
            role="tablist"
            aria-label="Ways to bring your puppy home"
            className="switch"
            style={{ "--at": activeIndex, "--n": journeys.length } as CSSProperties}
            onKeyDown={handleKeyDown}
          >
            <span aria-hidden="true" className="switch__thumb" />
            {journeys.map((journey) => (
              <button
                key={journey.key}
                ref={(element) => {
                  tabRefs.current[journey.key] = element;
                }}
                type="button"
                role="tab"
                id={`tab-${journey.key}`}
                aria-selected={journey.key === active}
                aria-controls={`panel-${journey.key}`}
                // Only the selected tab is in the tab order; arrow keys reach the others.
                tabIndex={journey.key === active ? 0 : -1}
                className="switch__tab"
                onClick={() => setActive(journey.key)}
              >
                <span className="font-plush switch__label">{journey.label}</span>
                <span className="switch__hint">{journey.hint}</span>
              </button>
            ))}
          </div>
          <Teddy
            pose="sit"
            facing="right"
            label="Teddy, waiting to see which way you pick"
            className="journeys__teddy"
          />
        </div>
      </div>

      {journeys.map((journey) => (
        <div
          key={journey.key}
          role="tabpanel"
          id={`panel-${journey.key}`}
          aria-labelledby={`tab-${journey.key}`}
          hidden={journey.key !== active}
          className="journey"
        >
          <div className="journey__head">
            <div>
              <h3 className="font-plush journey__title">{journey.heading}</h3>
              <p className="text-lede mt-4 text-[var(--ink-soft)]">{journey.body}</p>
              {journey.note && <p className="font-scrawl mt-4 text-toffee-ink">{journey.note}</p>}
            </div>
            <Postcard journey={journey.key} />
          </div>

          <ol className="steps">
            {journey.steps.map((step, index) => (
              <li
                key={step.title}
                className="step"
                style={{ "--i": index, "--tint": STEP_TINTS[index % STEP_TINTS.length] } as CSSProperties}
              >
                <span aria-hidden="true" className="step__icon">
                  <StepIcon name={step.icon} />
                </span>
                <span className="step__num font-plush">Step {index + 1}</span>
                <h4 className="font-plush-text step__title">{step.title}</h4>
                <p className="step__text">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}
