// "Visit us in Downtown Dubai": a shopfront card with the address, a maps link and a photo in an arch.

import Image from "next/image";
import { PawIcon } from "@/components/decor/icons";
import { DubaiSkyline } from "@/components/decor/DubaiSkyline";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/siteConfig";
import { focalPosition } from "@/lib/puppies";
import type { PuppyImage } from "@/types/puppy";

export function VisitCard({ photo }: { photo: PuppyImage }) {
  return (
    <section aria-labelledby="visit-title" className="shopfront mt-12">
      <DubaiSkyline className="absolute -bottom-1 right-0 w-3/4 text-toffee/30" />
      <div className="visit relative p-7 pt-6">
        <div>
          <h2 id="visit-title" className="font-plush text-[2rem] leading-tight">
            Visit us in Downtown Dubai
          </h2>
          <p className="mt-3 max-w-[38ch] text-cocoa-soft">
            Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.
          </p>
          <p className="mt-4 flex items-center gap-2 font-semibold">
            <PawIcon className="size-5 shrink-0 text-toffee-deep" />
            {siteConfig.contact.address}
          </p>
          <Button variant="ghost" href={siteConfig.contact.mapsUrl} className="mt-6 bg-milk">
            Open in Google Maps
          </Button>
        </div>
        <figure className="visit__photo">
          <Image
            src={photo.src}
            alt="A teddy bear puppy from our showroom, held up to say hello"
            fill
            sizes="(min-width: 640px) 11rem, 90vw"
            className="object-cover"
            style={{ objectPosition: focalPosition(photo), backgroundColor: photo.color }}
          />
        </figure>
      </div>
    </section>
  );
}
