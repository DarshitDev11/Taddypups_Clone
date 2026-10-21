// Sticky "WhatsApp us" + "Call" bar at the bottom of the screen. Phones only (hidden from 768px up).

import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/siteConfig";
import { generalWhatsAppLink } from "@/lib/whatsapp";

export function MobileActionBar() {
  return (
    <div
      data-whatsapp-bar
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-cocoa bg-milk px-3 pt-2.5 pb-[calc(0.6rem+env(safe-area-inset-bottom))] md:hidden"
    >
      <div className="mx-auto flex max-w-md gap-2">
        <Button variant="whatsapp" href={generalWhatsAppLink} className="min-h-12 flex-1 shadow-none">
          WhatsApp us
        </Button>
        <Button variant="ghost" href={siteConfig.contact.phoneHref} className="min-h-12 px-5">
          Call
        </Button>
      </div>
    </div>
  );
}
