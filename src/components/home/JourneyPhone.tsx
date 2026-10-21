// The phone in "Your puppy journey": a WhatsApp chat whose replies appear step by step (shown/hidden by CSS from data-step).

import Image from "next/image";
import Link from "next/link";
import { ChatClip } from "@/components/home/ChatClip";
import { chatBreeds } from "@/components/home/homeContent";
import { siteConfig } from "@/data/siteConfig";
import { getCoverImage, getPuppyBySlug } from "@/lib/puppies";
import { generalWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";

// The four showroom snapshots sent in the chat, and Max's video clip (the original's clip was not captured).
const SHOWROOM_SNAPS = ["/showroom/0.jpg", "/showroom/1.jpg", "/showroom/2.jpg", "/showroom/3.jpg"];
const CHAT_PUPPY = "maltipoo-max-male";

/** Paw outline (64-unit box), used as the footprints on the route sketch. */
const PAW_PATH =
  "M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z";

/** Three bouncing dots shown for a moment before a group of replies arrives. */
function Typing() {
  return (
    <div className="home-typing" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

export function JourneyPhone() {
  const puppy = getPuppyBySlug(CHAT_PUPPY)!;
  const cover = getCoverImage(puppy);
  const video = puppy.media.find((item) => item.kind === "video");
  const poster = video?.kind === "video" ? video.poster : cover;


  return (
    <div className="home-phone" role="group" aria-label="A WhatsApp conversation with TeddyPups U.A.E.">
      <div className="home-phone__bar">
        <Image src="/brand/logo.png" alt="" width={40} height={40} className="home-phone__avatar" />
        <span>
          <span className="home-phone__name">{siteConfig.name}</span>
          <span className="home-phone__status">online</span>
        </span>
      </div>

      <div className="home-phone__screen">
        <p className="home-msg home-msg--me">{whatsappMessages.general}</p>

        {/* Step 1 reply: breed chips that open the filtered list. */}
        <div className="home-msgs" data-reply="1">
          <Typing />
          <div className="home-msg home-msg--them">
            Which breed has your heart? Here&apos;s who we have right now:
            <nav className="home-chips" aria-label="Breeds we have now">
              {chatBreeds.map((breed) => (
                <Link key={breed.slug} href={`/puppies?breed=${breed.slug}`}>
                  {breed.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Step 2 reply: photos, a video clip and a line of text. */}
        <div className="home-msgs" data-reply="2">
          <Typing />
          <div className="home-msg home-msg--them home-msg--media">
            <div className="home-snaps">
              {SHOWROOM_SNAPS.map((src) => (
                <span key={src} className="home-snaps__one">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="6rem"
                    style={{ objectFit: "cover", objectPosition: "50% 35%" }}
                  />
                </span>
              ))}
            </div>
          </div>
          <div className="home-msg home-msg--them home-msg--media">
            {video ? (
              <ChatClip src={video.src} poster={poster.src} label="video of a tiny apricot teddy bear puppy" />
            ) : null}
          </div>
          <p className="home-msg home-msg--them">
            Our team will share real photos, health details, and all necessary information directly on WhatsApp.
          </p>
        </div>

        {/* Step 3 reply: a dotted route from the breeder to a little house. */}
        <div className="home-msgs" data-reply="3">
          <Typing />
          <div className="home-msg home-msg--them">
            Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and
            stress-free.
            <svg viewBox="0 0 220 70" aria-hidden="true" className="home-route">
              <path d="M14 52 C 60 6, 120 70, 170 28" className="home-route__line" />
              <circle cx="14" cy="52" r="5" className="home-route__dot" />
              <path d="M164 32 l12 -12 l12 12 v14 h-24 z" className="home-route__home" />
              <path d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z" className="home-route__heart" />
              <path d={PAW_PATH} transform="translate(70 22) scale(.3) rotate(70 32 32)" className="home-route__paw" />
              <path d={PAW_PATH} transform="translate(104 38) scale(.3) rotate(100 32 32)" className="home-route__paw" />
            </svg>
          </div>
        </div>
      </div>

      <a href={generalWhatsAppLink} target="_blank" rel="noopener noreferrer" className="home-phone__compose">
        <span>Say hello on WhatsApp</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
        </svg>
      </a>
    </div>
  );
}
