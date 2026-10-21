// /gone-home: every puppy that found a family, as a wall of "admit one" tickets.

import { HeartIcon } from "@/components/decor/icons";
import { Ticket } from "@/components/puppies/Ticket";
import { TicketBooth } from "@/components/puppies/TicketBooth";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/metadata";
import { getGoneHomePuppies } from "@/lib/puppies";

export const metadata = pageMetadata("goneHome");

export default function GoneHomePage() {
  const puppies = getGoneHomePuppies();

  return (
    <div data-page="gone">
      <Container className="pt-10 pb-24 md:pt-16">
        <header className="booth-head">
          <div className="max-w-3xl">
            <h1 className="font-plush text-giant">
              Gone home
              <HeartIcon className="ml-3 inline-block w-[0.45em] -translate-y-[0.15em] text-toffee" />
            </h1>
            <p className="text-lede mt-6 text-cocoa-soft">
              Every puppy here has already joined a loving family. Looking for one just like them? Tell us —
              we&apos;ll help you find your match.
            </p>
            <Button href="/puppies" className="mt-8">
              See available puppies
            </Button>
          </div>
          <TicketBooth />
        </header>

        <ul className="tickets" aria-label="Puppies who have gone home">
          {puppies.map((puppy, index) => (
            <Ticket key={puppy.slug} puppy={puppy} index={index} />
          ))}
        </ul>
      </Container>
    </div>
  );
}
