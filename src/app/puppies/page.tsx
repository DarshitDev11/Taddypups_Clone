// /puppies: the sketchbook of available puppies, with filters kept in the URL, then the "gone home" strip.

import { Suspense } from "react";
import { FilterPad } from "@/components/puppies/FilterPad";
import { GoneStrip } from "@/components/puppies/GoneStrip";
import { PuppyBrowser } from "@/components/puppies/PuppyBrowser";
import { PuppyResults } from "@/components/puppies/PuppyResults";
import { SketchbookHead } from "@/components/puppies/SketchbookHead";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/metadata";
import { getAvailablePuppies } from "@/lib/puppies";

export const metadata = pageMetadata("puppies");

export default function PuppiesPage() {
  const puppies = getAvailablePuppies();

  return (
    <div data-page="pups">
      <section aria-labelledby="pups-title" className="sketchbook">
        <Container className="pb-24 pt-10 md:pt-16">
          <SketchbookHead />

          <div className="mt-12">
            {/*
              PuppyBrowser reads the URL, which a statically built page cannot do, so it must sit in
              <Suspense>. The fallback is the same page with no filters: the built HTML lists every
              puppy and the browser takes over from there.
            */}
            <Suspense
              fallback={
                <>
                  <FilterPad filters={{}} />
                  <PuppyResults puppies={puppies} total={puppies.length} isFiltered={false} />
                </>
              }
            >
              <PuppyBrowser puppies={puppies} />
            </Suspense>
          </div>
        </Container>
      </section>

      <GoneStrip />
    </div>
  );
}
