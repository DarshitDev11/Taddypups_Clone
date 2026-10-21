// Teddy, the TeddyPups mascot: one SVG drawing that can strike a few static poses.
//
// The drawing is split into named parts (data-p="head", "tail", ...). A pose is just numbers
// (where each part sits and how far it is rotated); `resolveParts` turns them into SVG
// transform/opacity attributes. The data-p names also let CSS animate single parts
// (see the basket animations in styles/shell.css).

import { cn } from "@/lib/utils";

export type TeddyPose = "peek" | "walk" | "sit" | "sniff" | "snug" | "bow";

interface PoseSpec {
  /** Torso, legs and tail. Hidden when only the head shows (peek, snug). */
  body: { visible: boolean; y: number; tilt: number };
  backLegsVisible: boolean;
  /** Rotation of the far and near front paw, in degrees. */
  frontLegAngles: [far: number, near: number];
  tailAngle: number;
  /** Seated hind leg, only drawn when sitting. */
  haunch: { visible: boolean; y: number };
  head: { x: number; y: number; tilt: number };
  earAngles: [left: number, right: number];
  eyes: "open" | "happy";
  tongueOut: boolean;
  /** Two paws resting on a ledge in front of the head (peeking over something). */
  ledgePaws: boolean;
  /** Soft ground shadow. Off when Teddy sits behind something. */
  shadow: boolean;
}

// Values measured from the original site's pose snapshots.
// "sniff" was not captured, so it is an approximation: the sitting pose with the head lowered.
const POSES: Record<TeddyPose, PoseSpec> = {
  peek: {
    body: { visible: false, y: 0, tilt: 0 },
    backLegsVisible: true,
    frontLegAngles: [0, 0],
    tailAngle: -20,
    haunch: { visible: false, y: 0 },
    head: { x: 0, y: 4, tilt: 0 },
    earAngles: [-6, 6],
    eyes: "open",
    tongueOut: true,
    ledgePaws: true,
    shadow: false,
  },
  walk: {
    body: { visible: true, y: 0, tilt: 0 },
    backLegsVisible: true,
    frontLegAngles: [0, 0],
    tailAngle: -6,
    haunch: { visible: false, y: 0 },
    head: { x: 0, y: 0, tilt: 0 },
    earAngles: [0, 0],
    eyes: "open",
    tongueOut: true,
    ledgePaws: false,
    shadow: true,
  },
  sit: {
    body: { visible: true, y: -2, tilt: -24 },
    backLegsVisible: false,
    frontLegAngles: [24, 24],
    tailAngle: 34,
    haunch: { visible: true, y: 1.44 },
    head: { x: -10, y: -6, tilt: 0 },
    earAngles: [0, 0],
    eyes: "open",
    tongueOut: true,
    ledgePaws: false,
    shadow: true,
  },
  sniff: {
    body: { visible: true, y: -2, tilt: -24 },
    backLegsVisible: false,
    frontLegAngles: [24, 24],
    tailAngle: 40,
    haunch: { visible: true, y: 1.44 },
    head: { x: -4, y: 4, tilt: 12 },
    earAngles: [0, 0],
    eyes: "open",
    tongueOut: false,
    ledgePaws: false,
    shadow: true,
  },
  snug: {
    body: { visible: false, y: 0, tilt: 0 },
    backLegsVisible: true,
    frontLegAngles: [0, 0],
    tailAngle: -20,
    haunch: { visible: false, y: 0 },
    head: { x: 0, y: 9, tilt: 4 },
    earAngles: [3, -3],
    eyes: "open",
    tongueOut: false,
    ledgePaws: true,
    shadow: false,
  },
  bow: {
    body: { visible: true, y: 2, tilt: 15 },
    backLegsVisible: true,
    frontLegAngles: [-67, -73],
    tailAngle: -32,
    haunch: { visible: false, y: -0.9 },
    head: { x: 14, y: 30, tilt: 0 },
    earAngles: [0, 0],
    eyes: "happy",
    tongueOut: true,
    ledgePaws: false,
    shadow: true,
  },
};

// Palette (DESIGN-SPEC 3.6)
const INK = "#2a170e"; // outlines
const FUR = "#f2be6b";
const SHADE = "#e4a352"; // ears and far legs
const CREAM = "#fbe3b4"; // muzzle
const CHEEK = "#f9b9a6";
const TONGUE = "#e98c8c";
const COLLAR = "#a24a1a";
const MOUTH = "#6b2a1c";
const WHITE = "#fff";

/** Shared stroke style of every outline. */
const LINE = { stroke: INK, strokeWidth: 3.4, strokeLinejoin: "round", strokeLinecap: "round" } as const;

type PartAttrs = { transform?: string; opacity?: number };

const shown = (visible: boolean): PartAttrs => ({ opacity: visible ? 1 : 0 });

/** Converts a pose into the transform/opacity attributes of each named part. */
function resolveParts(pose: PoseSpec) {
  return {
    shadow: { opacity: pose.shadow ? 0.12 : 0 },
    body: {
      transform: `translate(0 ${pose.body.y}) rotate(${pose.body.tilt} 196 206)`,
      opacity: pose.body.visible ? 1 : 0,
    },
    bf: { transform: "translate(94 192)", ...shown(pose.backLegsVisible) },
    bn: { transform: "translate(110 194)", ...shown(pose.backLegsVisible) },
    ff: { transform: `translate(168 192) rotate(${pose.frontLegAngles[0]})` },
    fn: { transform: `translate(186 194) rotate(${pose.frontLegAngles[1]})` },
    tail: { transform: `rotate(${pose.tailAngle} 84 150)` },
    haunch: { transform: `translate(0 ${pose.haunch.y})`, ...shown(pose.haunch.visible) },
    head: { transform: `translate(${pose.head.x} ${pose.head.y}) rotate(${pose.head.tilt} 212 100)` },
    earL: { transform: `rotate(${pose.earAngles[0]} 174 82)` },
    earR: { transform: `rotate(${pose.earAngles[1]} 250 82)` },
    open: shown(pose.eyes === "open"),
    happy: shown(pose.eyes === "happy"),
    shut: shown(false), // closed eyes: only shown by the blink animation in CSS
    tongue: shown(pose.tongueOut),
    mouth: shown(false), // open mouth, reserved for a future "woof" reaction
    ledge: shown(pose.ledgePaws),
  };
}

interface TeddyProps {
  pose?: TeddyPose;
  /** Teddy is drawn facing right; "left" mirrors the whole drawing. */
  facing?: "left" | "right";
  /** Accessible description. Leave out when Teddy is purely decorative. */
  label?: string;
  className?: string;
}

export function Teddy({ pose = "sit", facing = "right", label, className }: TeddyProps) {
  const parts = resolveParts(POSES[pose]);
  const flip = facing === "left" ? "translate(150 0) scale(-1 1) translate(-150 0)" : undefined;

  return (
    <svg
      viewBox="0 0 300 240"
      className={cn("teddy overflow-visible", className)}
      focusable="false"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <g data-p="root" transform={flip}>
        <ellipse data-p="shadow" cx="150" cy="230" rx="92" ry="7" fill={INK} {...parts.shadow} />
        <g data-p="body" {...parts.body}>
          <g data-p="bf" {...parts.bf}>
            <path
              d="M-14 -14 C-14 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 14 4 14 -14Z"
              fill={SHADE}
            />
            <path
              d="M-14 -14 C-14 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 14 4 14 -14"
              {...LINE}
              fill="none"
            />
            <path d="M-3.5 29 v5 M4.5 29 v5" {...LINE} strokeWidth="2.4" fill="none" />
          </g>
          <g data-p="ff" {...parts.ff}>
            <path
              d="M-11 -14 C-11 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 11 4 11 -14Z"
              fill={SHADE}
            />
            <path
              d="M-11 -14 C-11 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 11 4 11 -14"
              {...LINE}
              fill="none"
            />
            <path d="M-3.5 29 v5 M4.5 29 v5" {...LINE} strokeWidth="2.4" fill="none" />
          </g>
          <g data-p="tail" {...parts.tail}>
            <path d="M86 152 C80 146 76 140 74 136" {...LINE} strokeWidth="9" fill="none" />
            <path
              d="M86 152 C80 146 76 140 74 136"
              stroke={FUR}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M70.0 110.0Q78.1 105.0 80.9 113.7Q90.5 114.8 86.7 123.2Q93.4 129.9 84.7 134.0Q85.2 143.1 75.8 141.0Q70.0 148.3 64.2 141.0Q54.8 143.1 55.3 134.0Q46.6 129.9 53.3 123.2Q49.5 114.8 59.1 113.7Q61.9 105.0 70.0 110.0Z"
              fill={FUR}
              {...LINE}
            />
          </g>
          <g data-p="bn" {...parts.bn}>
            <path
              d="M-15 -14 C-15 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 15 4 15 -14Z"
              fill={FUR}
            />
            <path
              d="M-15 -14 C-15 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 15 4 15 -14"
              {...LINE}
              fill="none"
            />
            <path d="M-3.5 27 v5 M4.5 27 v5" {...LINE} strokeWidth="2.4" fill="none" />
          </g>
          <path
            d="M76.8 175.6Q69.0 167.9 78.2 160.7Q76.6 151.8 90.3 147.3Q95.2 138.9 110.9 137.9Q121.6 131.3 136.7 134.0Q151.1 130.5 162.9 136.4Q178.7 136.4 185.3 144.5Q199.7 148.2 199.7 157.1Q210.3 163.7 203.9 171.9Q208.7 180.4 197.0 186.3Q195.3 195.2 180.3 198.0Q172.3 205.7 156.6 204.8Q143.7 210.0 130.0 205.6Q114.5 207.4 105.1 200.2Q89.7 198.3 86.3 189.6Q73.6 184.3 76.8 175.6Z"
            fill={FUR}
            {...LINE}
          />
          <path
            d="M182.7 196.4Q169.4 196.9 166.6 183.0Q156.1 174.1 162.3 161.5Q159.6 147.6 171.9 142.2Q178.2 129.7 191.0 134.0Q203.3 128.7 210.5 140.8Q223.1 145.2 221.3 159.3Q228.4 171.5 218.5 181.0Q216.6 195.1 203.2 195.7Q193.3 205.1 182.7 196.4Z"
            fill={FUR}
            {...LINE}
          />
          <g data-p="fn" {...parts.fn}>
            <path
              d="M-12 -14 C-12 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 12 4 12 -14Z"
              fill={FUR}
            />
            <path
              d="M-12 -14 C-12 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 12 4 12 -14"
              {...LINE}
              fill="none"
            />
            <path d="M-3.5 27 v5 M4.5 27 v5" {...LINE} strokeWidth="2.4" fill="none" />
          </g>
        </g>
        <g data-p="haunch" {...parts.haunch}>
          <path
            d="M80.0 204.0Q75.1 194.9 85.7 189.9Q88.4 180.2 100.7 181.2Q110.0 174.6 119.3 181.2Q131.6 180.2 134.3 189.9Q144.9 194.9 140.0 204.0Q144.9 213.1 134.3 218.1Q131.6 227.8 119.3 226.8Q110.0 233.4 100.7 226.8Q88.4 227.8 85.7 218.1Q75.1 213.1 80.0 204.0Z"
            fill={FUR}
            {...LINE}
          />
          <path
            d="M112 214 C126 212 142 214 146 221 C148 226 144 229 136 229 L116 229 C108 229 104 224 106 219 Z"
            fill={FUR}
            {...LINE}
          />
          <path d="M132 222v5M139 222v5" {...LINE} strokeWidth="2.4" fill="none" />
        </g>
        <g data-p="head" {...parts.head}>
          <path
            d="M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z"
            fill={COLLAR}
            {...LINE}
            strokeWidth="3"
          />
          <path
            d="M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z"
            fill={CREAM}
            {...LINE}
            strokeWidth="2.4"
          />
          <path
            data-p="earL"
            d="M177.1 78.7Q186.9 70.8 186.6 87.4Q196.0 89.9 189.9 105.5Q195.2 117.3 185.5 126.0Q184.7 142.8 175.2 141.2Q168.7 156.5 162.9 145.3Q153.1 153.2 153.4 136.6Q144.0 134.1 150.1 118.5Q144.8 106.7 154.5 98.0Q155.3 81.2 164.8 82.8Q171.3 67.5 177.1 78.7Z"
            fill={SHADE}
            {...LINE}
            {...parts.earL}
          />
          <path
            data-p="earR"
            d="M246.9 78.7Q252.7 67.5 259.2 82.8Q268.7 81.2 269.5 98.0Q279.2 106.7 273.9 118.5Q280.0 134.1 270.6 136.6Q270.9 153.2 261.1 145.3Q255.3 156.5 248.8 141.2Q239.3 142.8 238.5 126.0Q228.8 117.3 234.1 105.5Q228.0 89.9 237.4 87.4Q237.1 70.8 246.9 78.7Z"
            fill={SHADE}
            {...LINE}
            {...parts.earR}
          />
          <path
            d="M212.0 54.0Q223.4 48.2 231.5 57.5Q244.5 56.1 248.1 67.5Q260.7 70.7 259.1 82.4Q269.4 89.7 263.0 100.0Q269.4 110.3 259.1 117.6Q260.7 129.3 248.1 132.5Q244.5 143.9 231.5 142.5Q223.4 151.8 212.0 146.0Q200.6 151.8 192.5 142.5Q179.5 143.9 175.9 132.5Q163.3 129.3 164.9 117.6Q154.6 110.3 161.0 100.0Q154.6 89.7 164.9 82.4Q163.3 70.7 175.9 67.5Q179.5 56.1 192.5 57.5Q200.6 48.2 212.0 54.0Z"
            fill={FUR}
            {...LINE}
          />
          <path
            d="M195.0 52.0Q190.7 45.8 200.0 43.5Q203.2 36.9 212.0 40.0Q220.8 36.9 224.0 43.5Q233.3 45.8 229.0 52.0Q233.3 58.2 224.0 60.5Q220.8 67.1 212.0 64.0Q203.2 67.1 200.0 60.5Q190.7 58.2 195.0 52.0Z"
            fill={FUR}
            {...LINE}
            strokeWidth="3"
          />
          <path
            d="M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z"
            fill={CREAM}
          />
          <circle cx="181" cy="116" r="7" fill={CHEEK} opacity="0.85" />
          <circle cx="243" cy="116" r="7" fill={CHEEK} opacity="0.85" />
          <g data-p="eyes">
            <g data-p="open" {...parts.open}>
              <g data-p="blink">
                <ellipse cx="194" cy="98" rx="7.4" ry="8.6" fill={INK} />
                <ellipse cx="230" cy="98" rx="7.4" ry="8.6" fill={INK} />
                <circle cx="196.6" cy="94.6" r="2.7" fill={WHITE} />
                <circle cx="232.6" cy="94.6" r="2.7" fill={WHITE} />
                <circle cx="192" cy="101.2" r="1.2" fill={WHITE} />
                <circle cx="228" cy="101.2" r="1.2" fill={WHITE} />
              </g>
            </g>
          </g>
          <path
            data-p="happy"
            d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101"
            {...LINE}
            fill="none"
            {...parts.happy}
          />
          <path
            data-p="shut"
            d="M186.5 97 Q194 103.5 201.5 97 M222.5 97 Q230 103.5 237.5 97"
            {...LINE}
            fill="none"
            {...parts.shut}
          />
          <path
            d="M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z"
            fill={INK}
          />
          <path
            d="M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2"
            {...LINE}
            strokeWidth="3"
            fill="none"
          />
          <path
            data-p="tongue"
            d="M207.6 127.4 Q212 136.6 216.4 127.4 Z"
            fill={TONGUE}
            stroke={INK}
            strokeWidth="2.2"
            strokeLinejoin="round"
            {...parts.tongue}
          />
          <g data-p="mouth" {...parts.mouth}>
            <path
              d="M203 126 Q212 122 221 126 Q219 138 212 139 Q205 138 203 126 Z"
              fill={MOUTH}
              {...LINE}
              strokeWidth="2.6"
            />
            <path
              d="M206.5 133.5 Q212 130 217.5 133.5 Q215 138 212 138 Q209 138 206.5 133.5 Z"
              fill={TONGUE}
            />
          </g>
        </g>
        <g data-p="ledge" {...parts.ledge}>
          <path
            d="M175 159 C175 148 181 142 190 142 C199 142 205 148 205 159 Z M219 159 C219 148 225 142 234 142 C243 142 249 148 249 159 Z"
            fill={FUR}
            {...LINE}
          />
          <path
            d="M186 153 v-4.5 M194 153 v-4.5 M230 153 v-4.5 M238 153 v-4.5"
            {...LINE}
            strokeWidth="2.4"
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
}
