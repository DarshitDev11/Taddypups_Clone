// Query helpers over the puppy data. Pages call these instead of importing the raw array,
// so swapping the data source later (database, CMS) only touches this file.

import { puppies } from "@/data/puppies";
import { siteConfig } from "@/data/siteConfig";
import type { BreedSlug, Puppy, PuppyCollection, PuppyGender, PuppyImage, PuppyOrigin } from "@/types/puppy";

// ---------- Queries ----------

export function getAllPuppies(): Puppy[] {
  return puppies;
}

export function getAvailablePuppies(): Puppy[] {
  return puppies.filter((puppy) => puppy.status === "available");
}

export function getGoneHomePuppies(): Puppy[] {
  return puppies.filter((puppy) => puppy.status === "gone");
}

export function getPuppyBySlug(slug: string): Puppy | undefined {
  return puppies.find((puppy) => puppy.slug === slug);
}

/** Every slug, for generateStaticParams and the sitemap. */
export function getPuppySlugs(): string[] {
  return puppies.map((puppy) => puppy.slug);
}

/**
 * The previous and next puppy on the same list (available puppies link to available ones,
 * gone puppies to gone ones). Wraps around at both ends.
 */
export function getAdjacentPuppies(puppy: Puppy): { previous: Puppy; next: Puppy } {
  const list = puppy.status === "available" ? getAvailablePuppies() : getGoneHomePuppies();
  const index = list.findIndex((item) => item.slug === puppy.slug);
  return {
    previous: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  };
}

// ---------- Filtering (the chips on /puppies) ----------

export interface PuppyFilters {
  origin?: PuppyOrigin;
  collection?: PuppyCollection;
  breed?: BreedSlug;
  /** "male" and "female" only; a boy-and-girl pair listing matches both. */
  gender?: Extract<PuppyGender, "male" | "female">;
}

export function filterPuppies(list: Puppy[], filters: PuppyFilters): Puppy[] {
  return list.filter(
    (puppy) =>
      (!filters.origin || puppy.origin === filters.origin) &&
      (!filters.collection || puppy.collection === filters.collection) &&
      (!filters.breed || puppy.breeds.includes(filters.breed)) &&
      (!filters.gender || puppy.gender === filters.gender || puppy.gender === "male-female"),
  );
}

// ---------- Display helpers ----------

/** The first image is the cover. Every puppy has at least one. */
export function getCoverImage(puppy: Puppy): PuppyImage {
  const cover = puppy.media.find((item): item is PuppyImage => item.kind === "image");
  if (!cover) throw new Error(`Puppy "${puppy.slug}" has no image`);
  return cover;
}

export const genderLabels: Record<PuppyGender, string> = {
  male: "Boy",
  female: "Girl",
  "male-female": "Boy & girl",
};

export const originLabels: Record<PuppyOrigin, string> = {
  imported: "Imported for you",
  local: "In Dubai",
};

/** CSS object-position that keeps the puppy's face in the crop, e.g. "53.8% 44.3%". */
export function focalPosition(image: Pick<PuppyImage, "focalX" | "focalY">): string {
  return `${image.focalX * 100}% ${image.focalY * 100}%`;
}

/** True when the puppy has a real name (not just its breed, like "Maltipoo"). */
export function hasOwnName(puppy: Puppy): boolean {
  return puppy.name !== puppy.breed;
}

/** Title and description for <head>, matching the original site's wording. */
export function getPuppyMetadata(puppy: Puppy): { title: string; description: string } {
  const gender = genderLabels[puppy.gender].toLowerCase();
  const where = puppy.origin === "imported" ? "imported" : "in Dubai";
  const hasVideo = puppy.media.some((item) => item.kind === "video");
  const photos = hasVideo ? "Real photos and video" : "Real photos";
  const intro = hasOwnName(puppy) ? `Meet ${puppy.name}` : `Meet this ${puppy.name}`;

  return {
    title: hasOwnName(puppy) ? `${puppy.name}, ${puppy.breed} puppy` : `${puppy.name} puppy (${gender})`,
    description: `${intro}: ${puppy.breed}, ${gender}, ${puppy.age} old, ${where}. ${photos} from ${siteConfig.name}.`,
  };
}
