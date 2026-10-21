// /faq: a dark corkboard of pinned question notes with live search.

import { FaqBoard } from "@/components/faq/FaqBoard";
import { InnerScene } from "@/components/ui/InnerScene";
import { faqs } from "@/data/faqs";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("faq");

export default function FaqPage() {
  return (
    <InnerScene sky={["#a95e32", "#331c11"]} tone="dark" className="faqroom" aria-labelledby="faq-title">
      <div className="gutter relative mx-auto max-w-page pt-10 pb-24 md:pt-16">
        <header className="max-w-4xl">
          <h1 id="faq-title" className="font-plush text-giant">
            Questions &amp; answers
          </h1>
          <p className="text-lede mt-6 max-w-[52ch] text-[var(--ink-soft)]">
            Can&apos;t find what you&apos;re looking for? Message us on WhatsApp — our team is available 24/7.
          </p>
        </header>

        <div className="mt-12 md:mt-16">
          <FaqBoard faqs={faqs} />
        </div>
      </div>
    </InnerScene>
  );
}
