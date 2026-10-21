// "Two ways to meet your puppy" scene: a wooden signpost splitting the Dubai showroom path from the imported path.

import Image from "next/image";
import { FlightPath } from "@/components/home/FlightPath";
import { ways } from "@/components/home/homeContent";
import { TeddyStop } from "@/components/home/TeddyStop";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getCoverImage, getPuppyBySlug } from "@/lib/puppies";

const SHOWROOM_PHOTO = { src: "/showroom/0.jpg", width: 1080, height: 1920 };
const FLIGHT_PUPPY = "korean-teacup-maltipoo-female";

export function TwoWaysHome() {
  const flight = getCoverImage(getPuppyBySlug(FLIGHT_PUPPY)!);

  return (
    <Section scene="paths" className="home-paths" aria-labelledby="paths-title">
      <div className="gutter mx-auto max-w-page">
        <h2 id="paths-title" className="home-paths__title font-plush text-huge">
          {ways.title}
        </h2>

        <div className="home-fork">
          <div aria-hidden="true" className="home-fork__post" />

          <article className="home-way home-way--left">
            <h3 className="home-sign home-sign--left font-plush">{ways.local.sign}</h3>
            <div className="home-way__scene">
              {/* Faint Dubai skyline behind the shop window. */}
              <svg viewBox="0 0 300 120" aria-hidden="true" className="home-way__skyline">
                <path
                  d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <figure className="home-window">
                <span className="home-window__glass">
                  <Image
                    src={SHOWROOM_PHOTO.src}
                    alt="A tiny apricot teddy bear puppy held up in the TeddyPups showroom"
                    fill
                    sizes="(min-width: 1024px) 12rem, 60vw"
                    style={{ objectFit: "cover", objectPosition: "50% 35%" }}
                  />
                </span>
                <figcaption className="font-scrawl">{ways.local.caption}</figcaption>
              </figure>
            </div>
            <p className="home-way__text">{ways.local.text}</p>
            <Button href={ways.local.href}>{ways.local.cta}</Button>
          </article>

          <article className="home-way home-way--right">
            <h3 className="home-sign home-sign--right font-plush">{ways.imported.sign}</h3>
            <div className="home-way__scene">
              {/* An SVG <image> cannot use next/image, so ask the image optimiser for a small copy directly. */}
              <FlightPath puppySrc={`/_next/image?url=${encodeURIComponent(flight.src)}&w=128&q=75`} />
            </div>
            <p className="home-way__text">{ways.imported.text}</p>
            <Button href={ways.imported.href}>{ways.imported.cta}</Button>
          </article>

          <TeddyStop pose="sit" className="home-fork__teddy" />
        </div>
      </div>
    </Section>
  );
}
