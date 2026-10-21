// Fixed copy and small lookup tables for the home page scenes (puppy and FAQ data come from lib/ and data/).

export const hero = {
  note: "every puppy is family",
  titleLines: ["Premium teacup", "puppies in Dubai"],
  lede: "Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.",
} as const;

/** Door leaf colours, cycled through the row of doors in this order. */
export const DOOR_COLOURS = ["#a24a1a", "#5a3a28", "#d4893f", "#b8644a", "#7a4a2e"] as const;

export const meet = {
  title: "Meet the pups",
  lede: "Real puppies, real photos, looking for their families right now.",
} as const;

export const ways = {
  title: "Two ways to meet your puppy",
  local: {
    sign: "Puppies in Dubai",
    caption: "In our showroom",
    text: "See them, love them, take them home. Come meet our locally available puppies before you decide.",
    cta: "Meet local puppies",
    href: "/puppies?origin=local",
  },
  imported: {
    sign: "Imported for you",
    text: "Exclusive Korean teacup puppies, delivered. Order from the world's most reputable breeders and let us handle the import.",
    cta: "See imported puppies",
    href: "/puppies?origin=imported",
  },
} as const;

export const journey = {
  title: "Your puppy journey",
  lede: "A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.",
  steps: [
    {
      title: "Choose your breed",
      text: "Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.",
    },
    {
      title: "Get photos & details",
      text: "Our team will share real photos, health details, and all necessary information directly on WhatsApp.",
    },
    {
      title: "Secure & safe delivery",
      text: "Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.",
    },
  ],
} as const;

/** Breed chips inside the first chat reply; `slug` matches the ?breed= filter on /puppies. */
export const chatBreeds = [
  { label: "Maltipoo", slug: "maltipoo" },
  { label: "Pomeranian", slug: "pomeranian" },
  { label: "Poodle", slug: "poodle" },
  { label: "Cavapoo", slug: "cavapoo" },
  { label: "Shih Tzu", slug: "shih-tzu" },
] as const;

export type StampShape = "round" | "ticket" | "oval" | "scallop";
export type StampIcon = "heart-pulse" | "plane" | "chat" | "globe";

interface StampContent {
  title: string;
  text: string;
  icon: StampIcon;
  shape: StampShape;
  /** Ink colour of the stamp. */
  ink: string;
  /** Rotation in degrees. */
  tilt: number;
}

/** The four rubber stamps in the passport book. */
export const trust: { kicker: string; title: string; stamps: StampContent[] } = {
  kicker: "puppy passport",
  title: "Why families trust TeddyPups",
  stamps: [
    {
      title: "Vet-checked & healthy",
      text: "Every puppy comes vaccinated, dewormed, and with a verified health certificate.",
      icon: "heart-pulse",
      shape: "round",
      ink: "#a24a1a",
      tilt: -8,
    },
    {
      title: "Korea to Dubai, safely",
      text: "Trusted breeders, safe travel, and premium care from start to finish.",
      icon: "plane",
      shape: "ticket",
      ink: "#1f6b45",
      tilt: 5,
    },
    {
      title: "Support 24/7",
      text: "Always here to help, from choosing your puppy to post-delivery support.",
      icon: "chat",
      shape: "oval",
      ink: "#5a3a28",
      tilt: -4,
    },
    {
      title: "Trusted by families worldwide",
      text: "Puppies delivered to loving homes all around the world.",
      icon: "globe",
      shape: "scallop",
      ink: "#c2622b",
      tilt: 7,
    },
  ],
};

export const families = {
  title: "Happy families & puppies",
  lede: "We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts.",
  quote:
    "TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.",
  author: "Sarah M., Dubai, UAE",
  cta: "See every happy family",
} as const;

export const faqTeaser = {
  title: "Questions, answered",
  cta: "Read all questions",
  /** How many questions from data/faqs.ts to show. */
  count: 3,
} as const;

export const finale = {
  title: "Ready to meet your new best friend?",
  lede: "Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe delivery across the UAE.",
  doormat: "welcome home",
} as const;
