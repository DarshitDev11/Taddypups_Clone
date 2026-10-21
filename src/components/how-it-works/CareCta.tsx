// Closing card of /how-it-works: a quality promise, two buttons and Teddy taking a bow.

import { Teddy } from "@/components/decor/Teddy";
import { Button } from "@/components/ui/Button";
import { generalWhatsAppLink } from "@/lib/whatsapp";

export function CareCta() {
  return (
    <section
      aria-labelledby="care-title"
      className="board mt-24 grid items-center gap-8 md:grid-cols-[1fr_auto] md:p-12"
    >
      <div>
        <h2 id="care-title" className="font-plush text-big">
          Unique and high quality puppies
        </h2>
        <p className="text-lede mt-5 max-w-[60ch] text-cocoa-soft">
          When you choose TeddyPups, you can trust that you&apos;re getting a puppy of the highest quality. We
          also provide guidance and support to new pet owners, offering advice on training, nutrition, and
          general care to ensure a smooth transition for you and your new furry friend.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="whatsapp" href={generalWhatsAppLink}>
            Ask us on WhatsApp
          </Button>
          <Button variant="ghost" href="/puppies">
            See available puppies
          </Button>
        </div>
      </div>
      <Teddy pose="bow" facing="left" label="Teddy, ready to play" className="mx-auto w-48 md:w-56" />
    </section>
  );
}
