// "Questions, answered" scene (night): twinkling stars, the first few FAQs and Teddy wondering beside them.

import { SparkleIcon } from "@/components/decor/icons";
import { faqTeaser } from "@/components/home/homeContent";
import { TeddyStop } from "@/components/home/TeddyStop";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { faqs } from "@/data/faqs";

/** Position (% of the scene), width (px) and twinkle delay (s) of each star. */
const STARS = [
  { left: "8%", top: "10%", size: 13, delay: 0 },
  { left: "41%", top: "6%", size: 8, delay: 0.6 },
  { left: "74%", top: "9%", size: 15, delay: 1.2 },
  { left: "95%", top: "35%", size: 11, delay: 1.8 },
  { left: "4%", top: "68%", size: 9, delay: 2.4 },
  { left: "34%", top: "88%", size: 6, delay: 0.3 },
  { left: "14%", top: "30%", size: 9, delay: 0.9 },
  { left: "62%", top: "92%", size: 9, delay: 1.5 },
  { left: "86%", top: "90%", size: 14, delay: 2.1 },
  { left: "30%", top: "50%", size: 14, delay: 2.7 },
  { left: "88%", top: "62%", size: 9, delay: 3 },
];

export function HomeFaq() {
  const questions = faqs.slice(0, faqTeaser.count);

  return (
    <Section scene="night" className="home-night" aria-labelledby="faq-title">
      <div aria-hidden="true" className="home-night__stars">
        {STARS.map((star) => (
          <SparkleIcon
            key={star.left + star.top}
            className="twinkle absolute text-honey"
            style={{ left: star.left, top: star.top, width: star.size, animationDelay: `${star.delay}s` }}
          />
        ))}
      </div>

      <div className="home-night__grid gutter">
        <div>
          <h2 id="faq-title" className="font-plush text-huge">
            {faqTeaser.title}
          </h2>
          <Button variant="ghost" href="/faq" className="mt-8">
            {faqTeaser.cta}
          </Button>
          <div className="home-night__pup">
            <TeddyStop pose="sniff" className="w-full" />
            <span aria-hidden="true" className="home-night__wonder font-plush">
              ?
            </span>
          </div>
        </div>

        <dl className="home-night__list">
          {questions.map((faq) => (
            <div key={faq.question}>
              <dt className="home-qa__q font-plush">
                <SparkleIcon className="home-qa__star" />
                {faq.question}
              </dt>
              <dd className="home-qa__a">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
