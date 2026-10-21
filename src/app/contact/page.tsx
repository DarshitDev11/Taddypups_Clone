// /contact: a letter to fill in on the right, phone, email and the showroom on the left.

import { Teddy } from "@/components/decor/Teddy";
import { VisitCard } from "@/components/contact/VisitCard";
import { ContactLetterForm, type PuppyOption } from "@/components/forms/ContactLetterForm";
import { Button } from "@/components/ui/Button";
import { InnerScene } from "@/components/ui/InnerScene";
import { siteConfig } from "@/data/siteConfig";
import { genderLabels, getAvailablePuppies, hasOwnName } from "@/lib/puppies";
import type { PuppyImage } from "@/types/puppy";
import { pageMetadata } from "@/lib/metadata";
import { generalWhatsAppLink } from "@/lib/whatsapp";

export const metadata = pageMetadata("contact");

/** One option per available puppy, written the way you'd say it: "Max (Maltipoo, boy)". */
function getPuppyOptions(): PuppyOption[] {
  return getAvailablePuppies().map((puppy) => {
    const gender = genderLabels[puppy.gender].toLowerCase();
    const label = hasOwnName(puppy)
      ? `${puppy.name} (${puppy.breed}, ${gender})`
      : `${puppy.breed} (${gender})`;
    return { value: puppy.slug, label };
  });
}

export default function ContactPage() {
  const { contact } = siteConfig;
  const showroomPhoto: PuppyImage = {
    kind: "image",
    src: "/showroom/3.jpg",
    width: 1080,
    height: 1920,
    alt: "The apricot teddy bear puppy from our showroom, held up to say hello",
    focalX: 0.5,
    focalY: 0.35,
    color: "#e8dfd3",
  };

  return (
    <InnerScene sky={["#fff9ee", "#f9dca4"]} aria-labelledby="contact-title">
      <div className="gutter mx-auto max-w-page pt-10 pb-24 md:pt-16">
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h1 id="contact-title" className="font-plush text-giant max-w-[12ch] lg:col-span-7">
            Get in touch with us
          </h1>
          <p className="text-lede text-[var(--ink-soft)] lg:col-span-5 lg:pb-3">
            Have questions about our puppies or adoption process? Fill out the form, and our team will get
            back to you promptly. Whether ready to adopt or just seeking info, we&apos;d love to hear from
            you!
          </p>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* The letter comes first in the markup (so it is first on phones) but sits on the right on desktop. */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <ContactLetterForm puppyOptions={getPuppyOptions()} />
            <Teddy pose="sit" facing="left" className="mt-[-0.75rem] mr-6 ml-auto w-36 md:w-40" />
          </div>

          <div className="lg:col-span-5 lg:row-start-1">
            <Button variant="whatsapp" href={generalWhatsAppLink} className="w-full sm:w-auto">
              WhatsApp {contact.phoneDisplay}
            </Button>
            <dl className="mt-10 space-y-6">
              <div>
                <dt className="font-scrawl text-[var(--ink-soft)]">call us</dt>
                <dd className="mt-1 text-lg font-semibold">
                  <a className="link-ink" href={contact.phoneHref}>
                    {contact.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-scrawl text-[var(--ink-soft)]">email</dt>
                <dd className="mt-1 text-lg font-semibold break-all">
                  <a className="link-ink" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </dd>
              </div>
            </dl>
            <VisitCard photo={showroomPhoto} />
          </div>
        </div>
      </div>
    </InnerScene>
  );
}
