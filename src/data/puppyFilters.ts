// Options for the filter chips on /puppies. The slugs are also the ?breed= / ?gender= URL values.

import type { BreedSlug } from "@/types/puppy";

export const breedFilterOptions: { slug: BreedSlug; label: string }[] = [
  { slug: "maltipoo", label: "Maltipoo" },
  { slug: "pomeranian", label: "Pomeranian" },
  { slug: "poodle", label: "Poodle" },
  { slug: "cavapoo", label: "Cavapoo" },
  { slug: "shih-tzu", label: "Shih Tzu" },
];

/** "Everywhere" (no filter) is added by the UI. "Korean Teacup" is a collection, "Imported" an origin. */
export const whereFilterOptions = [
  { param: "origin", value: "imported", label: "Imported" },
  { param: "collection", value: "korean-teacup", label: "Korean Teacup" },
] as const;

export const genderFilterOptions = [
  { value: "male", label: "Boys" },
  { value: "female", label: "Girls" },
] as const;
