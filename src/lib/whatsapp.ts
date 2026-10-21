// Builds wa.me links with a pre-filled message. The number comes from siteConfig.

import { siteConfig } from "@/data/siteConfig";
import type { Puppy } from "@/types/puppy";

/** Ready-made messages, so wording stays identical everywhere. */
export const whatsappMessages = {
  general: "Hi TeddyPups! I'd love to know more about your puppies.",
  question: "Hi TeddyPups! I have a question:",
  /** e.g. "Hi TeddyPups! I'm interested in Max, the Maltipoo: https://…/puppies/maltipoo-max-male" */
  puppy: (puppy: Pick<Puppy, "slug" | "name" | "breed">) =>
    `Hi TeddyPups! I'm interested in ${puppy.name}, the ${puppy.breed}: ${siteConfig.url}/puppies/${puppy.slug}`,
  /** For a puppy that has gone home: ask whether there is another one like it. */
  similarPuppy: (puppy: Pick<Puppy, "slug" | "name">) =>
    `Hi TeddyPups! I loved ${puppy.name} (${siteConfig.url}/puppies/${puppy.slug}). Do you have a puppy like them?`,
} as const;

/** https://wa.me/<number>?text=<url-encoded message> */
export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** The generic "tell me about your puppies" link used by header, hero, footer and sticky bar. */
export const generalWhatsAppLink = buildWhatsAppLink(whatsappMessages.general);
