// /how-it-works: the two ways to get a puppy, the premium promise, delivery and why choose us.

import { CareCta } from "@/components/how-it-works/CareCta";
import { DeliverySection } from "@/components/how-it-works/DeliverySection";
import { PremiumPromise } from "@/components/how-it-works/PremiumPromise";
import { WaysHome } from "@/components/how-it-works/WaysHome";
import { WhyChooseUs } from "@/components/how-it-works/WhyChooseUs";
import { InnerScene } from "@/components/ui/InnerScene";
import { journeys, pageSections } from "@/data/howItWorks";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("howItWorks");

export default function HowItWorksPage() {
  return (
    <InnerScene sky={["#fffbf3", "#f6cc85"]} aria-labelledby="how-title">
      <div className="gutter mx-auto max-w-page pt-10 pb-24 md:pt-16">
        <header className="grid gap-8 md:grid-cols-12 md:items-end">
          <h1 id="how-title" className="font-plush text-giant md:col-span-7">
            How it works
          </h1>
          <p className="text-lede text-[var(--ink-soft)] md:col-span-5 md:pb-4">
            Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups is here
            to make the experience unforgettable.
          </p>
        </header>

        {/* Jump links; the footer's "Delivery & collection" link lands on #delivery. */}
        <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2">
          {pageSections.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="chip h-11 border-2 border-cocoa bg-milk px-4 hover:bg-honey-soft"
            >
              <span className="font-plush text-toffee">{index + 1}</span> {section.label}
            </a>
          ))}
        </nav>

        <div id="two-ways">
          <WaysHome journeys={journeys} />
        </div>
        <PremiumPromise />
        <DeliverySection />
        <WhyChooseUs />
        <CareCta />
      </div>
    </InnerScene>
  );
}
