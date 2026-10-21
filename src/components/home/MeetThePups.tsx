// "Meet the pups" scene: every available puppy behind its own arched door, with Teddy walking the floor.

import Link from "next/link";
import { DOOR_COLOURS, meet } from "@/components/home/homeContent";
import { MeetScroller } from "@/components/home/MeetScroller";
import { PuppyDoor } from "@/components/home/PuppyDoor";
import { TeddyStop } from "@/components/home/TeddyStop";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getAvailablePuppies } from "@/lib/puppies";

export function MeetThePups() {
  const puppies = getAvailablePuppies();

  return (
    <Section scene="meet" className="home-meet" aria-labelledby="meet-title">
      <MeetScroller>
        <div className="home-meet__stage">
          <header className="home-meet__head gutter">
            <div>
              <h2 id="meet-title" className="font-plush text-huge">
                {meet.title}
              </h2>
              <p className="text-lede mt-3 max-w-[44ch] text-(--ink-soft)">{meet.lede}</p>
            </div>
            <Button href="/puppies" className="shrink-0">
              See all available puppies
            </Button>
          </header>

          <div className="home-meet__hall">
            <ol className="home-meet__track" data-track="" aria-label="Puppies looking for a family">
              {puppies.map((puppy, index) => (
                <PuppyDoor key={puppy.slug} puppy={puppy} colour={DOOR_COLOURS[index % DOOR_COLOURS.length]} />
              ))}
              {/* The last "door" is an empty outline that leads to the full list. */}
              <li className="home-door home-door--all">
                <Link href="/puppies" className="home-door__link">
                  <span className="home-door__frame home-door__frame--all">
                    <span className="home-door__all font-plush">Meet them all</span>
                  </span>
                </Link>
              </li>
            </ol>
            <div aria-hidden="true" className="home-meet__floor" />
            <TeddyStop pose="walk" className="home-meet__teddy" />
          </div>
        </div>
      </MeetScroller>
    </Section>
  );
}
