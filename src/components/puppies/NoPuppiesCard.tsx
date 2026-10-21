// Empty state for /puppies when the filters match nothing: Teddy, a friendly note and a way to ask anyway.

import { Teddy } from "@/components/decor/Teddy";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";

type NoPuppiesCardProps = {
  onClear?: () => void;
};

export function NoPuppiesCard({ onClear }: NoPuppiesCardProps) {
  return (
    <div className="no-puppies">
      <Teddy pose="peek" className="no-puppies__teddy" />
      <div>
        <h2 className="font-plush text-big">No puppies match just now.</h2>
        <p className="mt-4 max-w-[52ch] text-cocoa-soft">
          Tell us what you&apos;re hoping for and we&apos;ll let you know what&apos;s in our next arrivals. Or
          try loosening a filter above.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="whatsapp" href={buildWhatsAppLink(whatsappMessages.general)}>
            Tell us on WhatsApp
          </Button>
          <Button variant="ghost" onClick={onClear}>
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  );
}
