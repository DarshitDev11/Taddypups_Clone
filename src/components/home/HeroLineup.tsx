"use client";

// The row of arched puppy photos peeking over the hero quilt. Every couple of seconds one photo ducks,
// swaps to another available puppy and pops back up with its name tag.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export interface LineupPuppy {
  slug: string;
  name: string;
  breed: string;
  src: string;
  /** CSS object-position that keeps the face in the crop. */
  position: string;
  color: string;
}

type SeatPhase = "rest" | "duck" | "pop";

/** Gaps between swaps (ms), cycled; the uneven rhythm keeps it from feeling mechanical. */
const SWAP_GAPS = [1900, 2500, 1700, 2300, 2000, 2800, 1800];
const DUCK_MS = 340;
const POP_MS = 580;
const TAG_MS = 1800;
/** A swap only happens when the visitor has stopped scrolling for this long. */
const SCROLL_IDLE_MS = 1200;
const SEAT_COUNT = 6;

const sizes = "(min-width: 1024px) 14rem, 24vw";

interface HeroLineupProps {
  /** Every puppy that may appear; the first SEAT_COUNT fill the seats at load. */
  puppies: LineupPuppy[];
}

export function HeroLineup({ puppies }: HeroLineupProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Index into `puppies` for each seat.
  const [seatPuppy, setSeatPuppy] = useState<number[]>(() => Array.from({ length: SEAT_COUNT }, (_, i) => i));
  // Same list as above, readable from the timers below without going stale.
  const seatPuppyRef = useRef(seatPuppy);
  const [phase, setPhase] = useState<{ seat: number; value: SeatPhase } | null>(null);
  const [tagSeat, setTagSeat] = useState<number | null>(null);
  const [hoverSeat, setHoverSeat] = useState<number | null>(null);
  // The puppy about to swap in: rendered hidden for a moment so its photo is loaded before the swap.
  const [incoming, setIncoming] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = rootRef.current;
    if (!root) return;

    let heroVisible = false;
    let lastScroll = 0;
    let gapIndex = 0;
    let lastSeat = -1;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    const observer = new IntersectionObserver(([entry]) => (heroVisible = entry.intersectionRatio >= 0.35), {
      threshold: [0, 0.35, 1],
    });
    observer.observe(root);
    const onScroll = () => (lastScroll = performance.now());
    window.addEventListener("scroll", onScroll, { passive: true });

    function swapOneSeat() {
      // Never the same seat twice in a row.
      let seat = Math.floor(Math.random() * SEAT_COUNT);
      if (seat === lastSeat) seat = (seat + 1) % SEAT_COUNT;
      lastSeat = seat;

      const current = seatPuppyRef.current;
      const free = puppies.map((_, i) => i).filter((i) => !current.includes(i));
      const next = free[Math.floor(Math.random() * free.length)];
      setIncoming(next);
      setPhase({ seat, value: "duck" });

      later(() => {
        seatPuppyRef.current = seatPuppyRef.current.map((p, i) => (i === seat ? next : p));
        setSeatPuppy(seatPuppyRef.current);
        setIncoming(null);
        setPhase({ seat, value: "pop" });
        setTagSeat(seat);
      }, DUCK_MS);
      later(() => setPhase(null), DUCK_MS + POP_MS);
      later(() => setTagSeat(null), DUCK_MS + TAG_MS);
    }

    function tick() {
      const idle = performance.now() - lastScroll > SCROLL_IDLE_MS;
      if (heroVisible && !document.hidden && idle) swapOneSeat();
      later(tick, SWAP_GAPS[gapIndex++ % SWAP_GAPS.length]);
    }
    later(tick, SWAP_GAPS[0]);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      timers.forEach(clearTimeout);
    };
  }, [puppies]);

  return (
    <div ref={rootRef} className="home-lineup-wrap">
      <ul className="home-lineup" aria-label="Some of the puppies in our showroom">
        {seatPuppy.map((puppyIndex, seat) => {
          const puppy = puppies[puppyIndex];
          const seatPhase = phase?.seat === seat ? phase.value : "rest";
          return (
            <li key={seat} className="home-lineup__seat" style={{ "--i": seat } as CSSProperties}>
              <Link
                href={`/puppies/${puppy.slug}`}
                aria-label={`Meet ${puppy.name}, ${puppy.breed}`}
                className="home-lineup__pup"
                data-state={seatPhase}
                onPointerEnter={() => setHoverSeat(seat)}
                onPointerLeave={() => setHoverSeat(null)}
                onFocus={() => setHoverSeat(seat)}
                onBlur={() => setHoverSeat(null)}
              >
                <span className="home-lineup__photo" style={{ backgroundColor: puppy.color }}>
                  <Image
                    key={puppy.slug}
                    src={puppy.src}
                    alt=""
                    fill
                    sizes={sizes}
                    style={{ objectFit: "cover", objectPosition: puppy.position }}
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Name tags live in their own list so they can sit above the quilt (a seat itself is behind it). */}
      <ul className="home-lineup home-lineup--tags" aria-hidden="true">
        {seatPuppy.map((puppyIndex, seat) => (
          <li key={seat} className="home-lineup__seat" style={{ "--i": seat } as CSSProperties}>
            <span className="home-lineup__name font-scrawl" data-show={tagSeat === seat || hoverSeat === seat}>
              {puppies[puppyIndex].name}
            </span>
          </li>
        ))}
      </ul>

      {incoming !== null && (
        <span className="home-lineup__preload" aria-hidden="true">
          <Image src={puppies[incoming].src} alt="" fill sizes={sizes} />
        </span>
      )}
    </div>
  );
}
