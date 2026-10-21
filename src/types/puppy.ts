// Types for puppy data. The data itself lives in src/data/puppies.ts.

export type PuppyStatus = "available" | "gone";

/** "male-female" is a pair listing (e.g. the Toy Poodle boy & girl). Values match the ?gender= URL param. */
export type PuppyGender = "male" | "female" | "male-female";

/** "local" = already in the Dubai showroom, "imported" = ordered from abroad. Matches the ?origin= URL param. */
export type PuppyOrigin = "imported" | "local";

/** Breeds offered as filter chips on /puppies. Matches the ?breed= URL param. */
export type BreedSlug = "maltipoo" | "pomeranian" | "poodle" | "cavapoo" | "shih-tzu";

/** Special groupings shown as filter chips. Only one exists today. Matches ?collection=. */
export type PuppyCollection = "korean-teacup";

interface MediaBase {
  /** Public URL, e.g. /puppies/copper-male/01.jpg */
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface PuppyImage extends MediaBase {
  kind: "image";
  /** Point of interest (0-1) used for object-position so faces stay in the crop. */
  focalX: number;
  focalY: number;
  /** Dominant colour, handy as a placeholder background while the image loads. */
  color: string;
}

export interface PuppyVideo extends MediaBase {
  kind: "video";
  durationS: number;
  /** Still frame shown before the video plays and as the thumbnail. */
  poster: PuppyImage;
}

export type PuppyMedia = PuppyImage | PuppyVideo;

export interface Puppy {
  /** URL slug, e.g. "copper-male" -> /puppies/copper-male */
  slug: string;
  /** Display name. For unnamed puppies this equals the breed (e.g. "Maltipoo"). */
  name: string;
  /** Breed as written on the profile, e.g. "Korean Teacup Pomeranian". */
  breed: string;
  /**
   * Filter slugs for the breed chips. Filled for the 15 available puppies and
   * empty for puppies that have already gone home (they are never filtered).
   */
  breeds: BreedSlug[];
  gender: PuppyGender;
  /** Free text from the original site, e.g. "2 months". */
  age: string;
  colour?: string;
  origin: PuppyOrigin;
  collection?: PuppyCollection;
  status: PuppyStatus;
  /** Photos and videos; the first image is the cover. */
  media: PuppyMedia[];
}
