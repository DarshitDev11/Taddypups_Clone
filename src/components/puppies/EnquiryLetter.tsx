// The "letter" panel at the bottom of a puppy page: a short note on the left, the enquiry form on the right.

import { PawIcon } from "@/components/decor/icons";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ChapterLabel } from "@/components/puppies/ChapterLabel";
import type { Puppy } from "@/types/puppy";

type EnquiryLetterProps = {
  puppy: Puppy;
  chapter: number;
};

export function EnquiryLetter({ puppy, chapter }: EnquiryLetterProps) {
  const titleId = `enquire-title-${puppy.slug}`;
  const isGone = puppy.status === "gone";

  return (
    // The id is the target of the "Send an enquiry" button in the tag card.
    <section
      id={`enquire-${puppy.slug}`}
      aria-labelledby={titleId}
      className="letter mt-20 grid gap-10 lg:grid-cols-12"
    >
      {/* A postage stamp stuck on the corner of the letter. */}
      <span aria-hidden="true" className="letter__stamp">
        <PawIcon className="size-9" />
      </span>

      <div className="lg:col-span-4">
        <ChapterLabel number={chapter}>dear TeddyPups…</ChapterLabel>
        <h2 id={titleId} className="font-plush text-big mt-2">
          {isGone ? "Looking for a puppy like this?" : `Ask about ${puppy.name}`}
        </h2>
        <p className="mt-4 text-cocoa-soft">
          Leave your details and our team will get back to you promptly — or message us on WhatsApp for the
          quickest reply.
        </p>
      </div>

      <div className="lg:col-span-7 lg:col-start-6">
        {/* Only the three fields the form needs cross to the browser, not the whole media list. */}
        <EnquiryForm puppy={{ slug: puppy.slug, name: puppy.name, breed: puppy.breed }} />
      </div>
    </section>
  );
}
