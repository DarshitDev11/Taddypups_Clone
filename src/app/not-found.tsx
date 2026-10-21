// 404 page: the "LOST" poster, centred on a light page that ends in the footer hill.

import { LostPoster } from "@/components/not-found/LostPoster";
import { InnerScene } from "@/components/ui/InnerScene";

export default function NotFound() {
  return (
    <InnerScene sky={["#fffdf8", "#fff1d8"]}>
      <div className="gutter mx-auto flex max-w-page justify-center pt-10 pb-24 md:pt-16">
        <LostPoster />
      </div>
    </InnerScene>
  );
}
