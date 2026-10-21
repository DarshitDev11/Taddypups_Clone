// Type for the happy-families photo wall. The data lives in src/data/happyFamilies.ts.

export interface HappyFamilyPhoto {
  /** Public URL, e.g. /families/01.jpeg */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Short handwritten caption; only some photos have one. */
  caption?: string;
  /** Point of interest (0-1) for object-position. */
  focalX: number;
  focalY: number;
  /** Dominant colour, used as a placeholder background. */
  color: string;
}
