// The "name tag" card on a puppy's page: status, name, details and the WhatsApp / enquiry buttons.

import { Teddy } from "@/components/decor/Teddy";
import { Reveal } from "@/components/puppies/Reveal";
import { Button } from "@/components/ui/Button";
import { StatusTag } from "@/components/ui/StatusTag";
import { genderLabels, originLabels } from "@/lib/puppies";
import { buildWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";
import type { Puppy } from "@/types/puppy";

type PuppyTagCardProps = {
  puppy: Puppy;
};

export function PuppyTagCard({ puppy }: PuppyTagCardProps) {
  const isGone = puppy.status === "gone";

  const details = [
    { label: "Breed", value: puppy.breed },
    { label: "Boy or girl", value: genderLabels[puppy.gender] },
    { label: "Age", value: puppy.age },
    { label: "Where", value: originLabels[puppy.origin] },
    ...(puppy.colour ? [{ label: "Colour", value: puppy.colour }] : []),
  ];

  return (
    // Reveal swings the tag in like a label on a string; the hole ring is where the string would go.
    <Reveal className="tag board mt-16 rounded-[2.2rem_2.2rem_2.2rem_0.6rem] p-7 md:p-9 lg:mt-20">
      <span aria-hidden="true" className="tag__ring" />
      <Teddy pose="peek" className="pointer-events-none absolute -top-[5.3rem] right-[1.4rem] w-40" />

      <StatusTag status={puppy.status} variant={isGone ? "stamp" : "chip"} />
      <h1 className="font-plush mt-4 text-[clamp(2.6rem,5vw,4.6rem)]">{puppy.name}</h1>
      <p className="mt-2 text-lg font-semibold text-cocoa-soft">{puppy.breed}</p>

      <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
        {details.map(({ label, value }) => (
          <div key={label}>
            <dt className="font-scrawl text-sm text-cocoa-soft">{label}</dt>
            <dd className="mt-0.5 text-[1.05rem] font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-3">
        <Button
          variant="whatsapp"
          href={buildWhatsAppLink(
            isGone ? whatsappMessages.similarPuppy(puppy) : whatsappMessages.puppy(puppy),
          )}
        >
          {isGone ? "Ask about a puppy like this" : `Ask about ${puppy.name} on WhatsApp`}
        </Button>
        <Button variant="ghost" href={`#enquire-${puppy.slug}`}>
          Send an enquiry
        </Button>
      </div>
    </Reveal>
  );
}
