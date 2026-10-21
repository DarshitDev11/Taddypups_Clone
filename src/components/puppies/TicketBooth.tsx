// The little ticket booth with Teddy peeking over the counter, beside the /gone-home title.

import { Teddy } from "@/components/decor/Teddy";

export function TicketBooth() {
  return (
    <div aria-hidden="true" className="booth">
      <Teddy pose="peek" className="booth__teddy" />
      <div className="booth__counter">
        <span className="font-plush">tickets home</span>
      </div>
    </div>
  );
}
