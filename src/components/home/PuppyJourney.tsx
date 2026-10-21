// "Your puppy journey" scene: three steps on the left, a phone on the right that fills with chat replies as you scroll.

import { journey } from "@/components/home/homeContent";
import { JourneyPhone } from "@/components/home/JourneyPhone";
import { JourneyTracker } from "@/components/home/JourneyTracker";
import { TeddyStop } from "@/components/home/TeddyStop";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export function PuppyJourney() {
  return (
    <Section scene="chat" className="home-journey" aria-labelledby="journey-title">
      <JourneyTracker className="home-journey__grid gutter">
        <div>
          <h2 id="journey-title" className="font-plush text-huge">
            {journey.title}
          </h2>
          <p className="text-lede mt-5 max-w-[42ch] text-(--ink-soft)">{journey.lede}</p>

          <ol className="home-journey__steps">
            {journey.steps.map((step, index) => (
              <li key={step.title} className="home-step" data-journey-step="">
                <span className="home-step__num font-plush">{index + 1}</span>
                <h3 className="home-step__title font-plush">{step.title}</h3>
                <p className="home-step__text">{step.text}</p>
              </li>
            ))}
          </ol>

          <Button variant="ghost" href="/how-it-works" className="mt-8">
            How it works
          </Button>
        </div>

        {/* Sticky on desktop, so the phone stays in view while the steps scroll past. */}
        <div className="home-journey__side">
          <JourneyPhone />
          <TeddyStop pose="sit" className="home-journey__teddy" />
        </div>
      </JourneyTracker>
    </Section>
  );
}
