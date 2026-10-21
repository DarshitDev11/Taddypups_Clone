// "Why families trust TeddyPups" scene: an open puppy passport whose four rubber stamps thump down as you scroll.

import type { CSSProperties } from "react";
import { trust } from "@/components/home/homeContent";
import { PassportStamp } from "@/components/home/PassportStamp";
import { SunsetHorizon } from "@/components/home/SunsetHorizon";
import { TeddyStop } from "@/components/home/TeddyStop";
import { Section } from "@/components/ui/Section";

export function WhyFamiliesTrust() {
  return (
    <Section scene="passport" className="home-passport" aria-labelledby="trust-title">
      <div className="gutter mx-auto max-w-[96rem]">
        <div className="home-book">
          <div className="home-book__page home-book__page--left">
            <p className="home-book__kicker font-scrawl">{trust.kicker}</p>
            <h2 id="trust-title" className="home-book__title font-plush">
              {trust.title}
            </h2>
            <TeddyStop pose="sit" className="home-book__teddy" />
          </div>

          <ul className="home-book__page home-book__page--right">
            {trust.stamps.map((stamp, index) => (
              <li
                key={stamp.title}
                className="home-entry"
                // --i staggers the scroll animation; --tilt and --ink-stamp are read by .home-stamp.
                style={{ "--i": index, "--tilt": `${stamp.tilt}deg`, "--ink-stamp": stamp.ink } as CSSProperties}
              >
                <PassportStamp title={stamp.title} icon={stamp.icon} shape={stamp.shape} />
                <p className="home-entry__text">{stamp.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SunsetHorizon />
    </Section>
  );
}
