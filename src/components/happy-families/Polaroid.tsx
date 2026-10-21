// One polaroid print on the wall: tape, photo at its natural shape and a handwritten caption strip.

import Image from "next/image";
import type { CSSProperties } from "react";
import { MaskingTape, type TapeVariant } from "@/components/decor/MaskingTape";
import type { HappyFamilyPhoto } from "@/types/happyFamily";

interface PolaroidProps {
  photo: HappyFamilyPhoto;
  /** Tilt in degrees; the hover state straightens it. */
  tilt: number;
  tapeColor: string;
  tapeVariant: TapeVariant;
  /** Load straight away (the first photos are above the fold) instead of lazily. */
  eager?: boolean;
}

export function Polaroid({ photo, tilt, tapeColor, tapeVariant, eager = false }: PolaroidProps) {
  return (
    <span className="memory-print" style={{ "--tilt": `${tilt}deg` } as CSSProperties}>
      <MaskingTape variant={tapeVariant} color={tapeColor} />
      <span className="memory-print__photo">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          // Columns: 4 on wide screens, 3 from tablets, 1 on phones.
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 90vw"
          loading={eager ? "eager" : "lazy"}
          // The dominant colour shows while the photo loads.
          style={{ width: "100%", height: "auto", backgroundColor: photo.color }}
        />
      </span>
      {/* The strip is always rendered so prints without a caption keep the same white border. */}
      <span className="memory-print__caption font-scrawl">{photo.caption}</span>
    </span>
  );
}
