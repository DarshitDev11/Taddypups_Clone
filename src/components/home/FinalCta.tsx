// Closing scene: "Ready to meet your new best friend?" with a little house, a glowing door that opens on scroll, and Teddy bowing.

import Image from "next/image";
import { finale } from "@/components/home/homeContent";
import { TeddyStop } from "@/components/home/TeddyStop";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { focalPosition, getCoverImage, getPuppyBySlug } from "@/lib/puppies";
import { generalWhatsAppLink } from "@/lib/whatsapp";

/** The puppy waiting behind the door. */
const WAITING_PUPPY = "maltipoo-max-male";

export function FinalCta() {
  const waiting = getCoverImage(getPuppyBySlug(WAITING_PUPPY)!);

  return (
    <Section scene="home" className="home-finale" aria-labelledby="finale-title">
      <div className="gutter mx-auto max-w-page">
        <h2 id="finale-title" className="home-finale__title font-plush text-huge">
          {finale.title}
        </h2>
        <p className="home-finale__lede">{finale.lede}</p>

        <div className="home-house">
          <div className="home-house__doorway">
            <div className="home-house__inside">
              <Image
                src={waiting.src}
                alt="Max, waiting inside"
                fill
                sizes="16rem"
                style={{ objectFit: "cover", objectPosition: focalPosition(waiting), backgroundColor: waiting.color }}
              />
            </div>
            <span aria-hidden="true" className="home-house__door">
              <span className="home-house__peep" />
              <span className="home-house__knob" />
            </span>
          </div>
          <span aria-hidden="true" className="home-house__lamp" />
          <span aria-hidden="true" className="home-house__plant home-house__plant--left" />
          <span aria-hidden="true" className="home-house__plant home-house__plant--right" />
          <span className="home-house__mat font-scrawl">{finale.doormat}</span>
          <TeddyStop pose="bow" className="home-house__teddy" />
        </div>

        <div className="home-finale__actions">
          <Button variant="whatsapp" href={generalWhatsAppLink}>
            Enquire on WhatsApp
          </Button>
          <Button variant="ghost" href="/contact">
            Visit &amp; contact
          </Button>
        </div>
      </div>
    </Section>
  );
}
