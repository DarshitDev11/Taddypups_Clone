// /happy-families: a wall of polaroids shared by families, with a quote note and a full-screen viewer.

import { Teddy } from "@/components/decor/Teddy";
import { HeartIcon } from "@/components/decor/icons";
import { MaskingTape } from "@/components/decor/MaskingTape";
import { MemoryWall } from "@/components/happy-families/MemoryWall";
import { Reveal } from "@/components/puppies/Reveal";
import { happyFamilyPhotos } from "@/data/happyFamilies";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("happyFamilies");

export default function HappyFamiliesPage() {
  return (
    <section className="memories" aria-labelledby="families-title">
      <div className="gutter mx-auto max-w-page pt-10 pb-24 md:pt-16">
        <div className="memories__head">
          <div>
            <Reveal as="p" className="font-scrawl text-lg text-toffee-ink">
              our wall of happy endings
            </Reveal>
            <Reveal as="h1" id="families-title" className="font-plush text-giant memories__title">
              Happy families
              <HeartIcon className="memories__heart" />
            </Reveal>
            <Reveal as="p" className="text-lede mt-6 max-w-[50ch] text-cocoa-soft">
              Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful
              moments shared by our amazing clients after welcoming their furry friends.
            </Reveal>
            <Reveal as="p" className="font-scrawl mt-5 text-lg text-toffee-ink">
              {happyFamilyPhotos.length} moments and counting
            </Reveal>
          </div>

          {/* A ruled note pinned to the wall with blue tape. */}
          <Reveal as="figure" className="memories__note">
            <MaskingTape variant="center" color="#cfe5f6" />
            <blockquote className="font-plush-text">
              “TeddyPups truly made our dream a reality. They supported us at every step of the import
              journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support
              throughout the process gave us complete peace of mind.”
            </blockquote>
            <figcaption className="font-scrawl">Sarah M., Dubai, UAE</figcaption>
          </Reveal>
        </div>

        <div className="mt-16 md:mt-20">
          <MemoryWall photos={happyFamilyPhotos} />
        </div>

        <Reveal className="memories__foot">
          <Teddy pose="sit" facing="right" className="w-32 md:w-36" />
          <p className="font-scrawl text-lg text-cocoa-soft">every one of them was a Teddy Pup once</p>
        </Reveal>
      </div>
    </section>
  );
}
