// "Already gone home" strip at the bottom of /puppies: a few small sketch cards and a link to /gone-home.

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/puppies/Reveal";
import { SketchCard } from "@/components/puppies/SketchCard";
import { getGoneHomePuppies } from "@/lib/puppies";

/** How many puppies the strip shows; the rest live on /gone-home. */
const STRIP_SIZE = 5;

export function GoneStrip() {
  const puppies = getGoneHomePuppies().slice(0, STRIP_SIZE);

  return (
    <section aria-labelledby="gone-title" className="gone-strip">
      <Container className="flex flex-col gap-10 md:flex-row md:items-center">
        <Reveal className="md:w-1/3">
          <h2 id="gone-title" className="font-plush text-big">
            Already gone home
          </h2>
          <p className="mt-3 text-cocoa-soft">These puppies have found their families.</p>
          <Button href="/gone-home" className="mt-6">
            See the puppies who&apos;ve gone home
          </Button>
        </Reveal>

        <ul className="gone-strip__row" aria-label="Some puppies who have gone home">
          {puppies.map((puppy, index) => (
            <SketchCard key={puppy.slug} puppy={puppy} index={index} small />
          ))}
        </ul>
      </Container>
    </section>
  );
}
