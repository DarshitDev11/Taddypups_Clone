// Generates the hand-drawn shapes of a sketch card (wash blob, photo mask, ink outline, doodles) from the puppy's slug.

// Why generated and not hand-written: every card needs its own slightly different wobble, and the shapes
// must be identical on every render (server and browser), so everything comes from a seeded random sequence.

type Point = { x: number; y: number };

/** Small seeded random generator (mulberry32): the same seed always gives the same sequence. */
function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** String to 32-bit number (FNV-1a), used to seed the generator from a slug. */
function hashString(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const round = (value: number) => Math.round(value * 100) / 100;

/** Points around an ellipse, each pushed in or out a little so the outline wobbles. */
function wobblyRing(random: () => number, centre: Point, radius: Point, wobble: number, count = 14): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (random() - 0.5) * 0.12;
    const push = 1 + (random() - 0.5) * 2 * wobble;
    return {
      x: centre.x + Math.cos(angle) * radius.x * push,
      y: centre.y + Math.sin(angle) * radius.y * push,
    };
  });
}

/**
 * Smooth curve through the points (Catmull-Rom converted to cubic Béziers).
 * Closed = loops back to the start; open = stops at the last point (used for the partial "retrace" stroke).
 */
function smoothPath(points: Point[], closed: boolean): string {
  const count = points.length;
  const at = (i: number) =>
    closed ? points[(i + count) % count] : points[Math.min(Math.max(i, 0), count - 1)];
  const segments = closed ? count : count - 1;

  let path = `M${round(points[0].x)} ${round(points[0].y)}`;
  for (let i = 0; i < segments; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    path += `C${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${round(p2.x)} ${round(p2.y)}`;
  }
  return closed ? `${path}Z` : path;
}

// ---------- Doodles ----------

/** Each doodle is drawn around (0, 0) in a roughly 10-unit box of the card's 100x100 drawing space. */
const PAW_PATH =
  "M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z";

const DOODLE_SHAPES = {
  // Filled paw: the 64-box icon shrunk to about 11 units and centred.
  paw: { d: PAW_PATH, transform: "scale(.17) translate(-32 -34)", filled: true },
  sparkle: { d: "M0 -6C.8 -2 2 -.8 6 0 2 .8.8 2 0 6-.8 2-2 .8-6 0-2-.8-.8-2 0-6Z", filled: true },
  heart: { d: "M0 5C-9 -1-6 -8 0-4 6-8 9-1 0 5Z", filled: false },
  swirl: {
    d: "M0 0c1.6-.6 2.4 1.4.8 2.6-2 1.4-4.6-.4-4-3 .7-3 4.8-3.8 6.8-1.2 2.4 3-.2 7.4-3.8 7.2",
    filled: false,
  },
  lines: { d: "M-5 -5l4 2M-6 0h5M-5 5l4 -2", filled: false },
  dots: { d: "M-4 -2h.01M0 3h.01M4 -3h.01", filled: false },
} as const;

type DoodleName = keyof typeof DOODLE_SHAPES;
const DOODLE_NAMES = Object.keys(DOODLE_SHAPES) as DoodleName[];
const DOODLE_COLOURS = ["#2a170e", "#c2622b", "#d4893f", "#a24a1a"];

export interface Doodle {
  d: string;
  /** Extra transform on the path itself (only the paw needs one). */
  shapeTransform?: string;
  /** Where the doodle sits on the card. */
  placement: string;
  colour: string;
  filled: boolean;
}

function pickDoodles(random: () => number): Doodle[] {
  const count = random() < 0.5 ? 1 : 2;
  // Three zones around the ring (left, top, bottom-right); the top-right corner stays free for the sticker.
  const zones = [random() * 1.2 + 2.2, random() * 1.0 + 4.2, random() * 1.2 + 0.2];
  const firstZone = Math.floor(random() * zones.length);

  return Array.from({ length: count }, (_, i) => {
    const name = DOODLE_NAMES[Math.floor(random() * DOODLE_NAMES.length)];
    const shape = DOODLE_SHAPES[name];
    const angle = zones[(firstZone + i) % zones.length];
    const distance = 52 + random() * 7;
    const x = 50 + Math.cos(angle) * distance;
    const y = 50 + Math.sin(angle) * distance;
    const scale = 0.85 + random() * 0.35;
    const tilt = (random() - 0.5) * 20;
    return {
      d: shape.d,
      shapeTransform: "transform" in shape ? shape.transform : undefined,
      placement: `translate(${round(x)} ${round(y)}) rotate(${round(tilt)}) scale(${round(scale)})`,
      colour: DOODLE_COLOURS[Math.floor(random() * DOODLE_COLOURS.length)],
      filled: shape.filled,
    };
  });
}

// ---------- The sketch ----------

const WASH_COLOURS = ["#f2be6b", "#bfddf5", "#f9cdbf", "#fbe3b4"];

export interface Sketch {
  /** Card tilt in degrees; hover tilts it the other way. */
  tilt: number;
  washColour: string;
  washPath: string;
  /** Offset of the wash blob, so the colour peeks out from one side like a misregistered print. */
  washOffset: { x: number; y: number };
  /** CSS `url("data:...")` for the photo's organic mask. */
  maskImage: string;
  inkPath: string;
  retracePath: string;
  doodles: Doodle[];
}

/** All the random decoration of one puppy's card. Same slug = same drawing every time. */
export function createSketch(slug: string): Sketch {
  const random = createRandom(hashString(slug));
  const centre = { x: 50, y: 50 };

  const washPath = smoothPath(wobblyRing(random, centre, { x: 46, y: 45 }, 0.05), true);
  const maskPath = smoothPath(wobblyRing(random, centre, { x: 48, y: 48 }, 0.035), true);

  // The pen outline is a bit bigger than the photo and shifted, the way a quick sketch misses the edge.
  const inkCentre = { x: 50 - 0.8 + random() * 1.2, y: 50 - 1 + random() * 1.2 };
  const inkPath = smoothPath(wobblyRing(random, inkCentre, { x: 49.6, y: 49.6 }, 0.04, 16), true);

  // A second, lighter pass that only covers part of the circle.
  const retraceRing = wobblyRing(random, { x: 49, y: 48.5 }, { x: 49, y: 49 }, 0.03, 16);
  const start = Math.floor(random() * 16);
  const length = 8 + Math.floor(random() * 4);
  const retracePoints = Array.from({ length }, (_, i) => retraceRing[(start + i) % 16]);

  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${maskPath}"/></svg>`;

  return {
    tilt: round((random() - 0.4) * 4.5),
    washColour: WASH_COLOURS[Math.floor(random() * WASH_COLOURS.length)],
    washPath,
    washOffset: { x: round(-5 + random() * 6), y: round(3 + random() * 3) },
    maskImage: `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`,
    inkPath,
    retracePath: smoothPath(retracePoints, false),
    doodles: pickDoodles(random),
  };
}
