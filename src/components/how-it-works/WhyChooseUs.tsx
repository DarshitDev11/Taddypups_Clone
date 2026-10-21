// "Why choose us": a short pitch on the left and three reasons with icons on the right.

import { LineIcon } from "@/components/how-it-works/HowItWorksIcons";
import { whyChooseUs } from "@/data/howItWorks";

export function WhyChooseUs() {
  return (
    <section id="why" aria-labelledby="why-title" className="mt-24 grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <h2 id="why-title" className="font-plush text-huge">
          Why choose us
        </h2>
        <p className="text-lede mt-6 text-[var(--ink-soft)]">
          We&apos;re here to help you find a new family member. From the moment you visit our site to the
          joyful day your puppy arrives at your door, we&apos;re with you every step of the way. Our mission
          is to make the entire adoption process smooth, transparent, and full of love.
        </p>
      </div>

      <ul className="space-y-8 lg:col-span-6 lg:col-start-7">
        {whyChooseUs.map((reason) => (
          <li key={reason.title} className="flex gap-5">
            <LineIcon name={reason.icon} className="size-14 shrink-0 text-toffee-deep" />
            <div>
              <h3 className="font-plush text-[1.7rem]">{reason.title}</h3>
              <p className="mt-2 text-[var(--ink-soft)]">{reason.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
