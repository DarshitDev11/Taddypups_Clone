"use client";

// The live Teddy. One fixed Teddy walks between the still [data-pup-stop] copies placed in the home scenes:
// it heads for the stop nearest the middle of the screen, trots while it is on the way and takes that stop's
// pose when it arrives (the still copy is hidden while the actor stands in for it).
// Below 768px it switches to "lane" mode and peeks in from alternating screen edges above the action bar.
// The hero's peeking Teddy stays still: he sits behind the quilt.

import { useEffect, useRef, useState } from "react";
import { Teddy, type TeddyPose } from "@/components/decor/Teddy";

const ART_W = 300;
const ART_H = 240;
const ARRIVED_PX = 36;
const BUBBLE_MS = 1400;
const HEART_MS = 1200;
const LANE_SCALE = 0.58;
const WOOFS = ["woof!", "woof woof!", "hm?", "ooh!"];

interface Look {
  pose: TeddyPose;
  facing: "left" | "right";
}

export function PupActor() {
  const layerRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState<Look>({ pose: "walk", facing: "right" });
  const [bubble, setBubble] = useState<string | null>(null);
  const [hearts, setHearts] = useState<number[]>([]);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const layer = layerRef.current;
    const actor = actorRef.current;
    if (!layer || !actor) return;
    const timerSet = timers.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stops = Array.from(document.querySelectorAll<HTMLElement>("[data-pup-stop]")).filter(
      (el) => el.dataset.pose !== "peek",
    );
    const hero = document.querySelector<HTMLElement>(".home-hero");
    if (!stops.length) return;

    const cur = { x: 0, y: 0, s: 1 };
    let placed = false;
    let frame = 0;
    let lastTime = 0;
    let lastScroll = -1;
    let activeStop: HTMLElement | null = null;
    let lastLook = "";
    let laneScene = -1;
    let laneSide: 1 | -1 = 1;

    const setActive = (stop: HTMLElement | null) => {
      if (activeStop === stop) return;
      activeStop?.removeAttribute("data-pup-active");
      stop?.setAttribute("data-pup-active", "");
      activeStop = stop;
    };

    const show = (visible: boolean) => {
      layer.style.opacity = visible ? "1" : "0";
    };

    const applyLook = (pose: TeddyPose, facing: "left" | "right") => {
      const key = `${pose}-${facing}`;
      if (key === lastLook) return;
      lastLook = key;
      setLook({ pose, facing });
    };

    const tick = (time: number) => {
      const dt = Math.min(0.05, (time - (lastTime || time)) / 1000);
      lastTime = time;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const lane = vw < 768;
      const heroGone = !hero || hero.getBoundingClientRect().bottom < vh * 0.7;

      // Nearest stop to the middle of the screen. Hidden (display:none) stops have no box, so lane mode
      // judges by the scene section around them instead.
      let best = -1;
      let bestDist = Infinity;
      let bestRect: DOMRect | null = null;
      stops.forEach((stop, i) => {
        const box = lane ? (stop.closest("section") ?? stop) : stop;
        const rect = box.getBoundingClientRect();
        if (!rect.width && !rect.height) return;
        const dist = Math.abs(rect.top + rect.height / 2 - vh / 2);
        if (dist < bestDist) {
          best = i;
          bestDist = dist;
          bestRect = rect;
        }
      });

      let settled = true;
      if (best < 0 || !bestRect || !heroGone) {
        setActive(null);
        show(false);
      } else if (lane) {
        const rect: DOMRect = bestRect;
        const inScene = rect.top < vh * 0.5 && rect.bottom > vh * 0.5;
        if (best !== laneScene) {
          laneScene = best;
          laneSide = best % 2 === 0 ? 1 : -1; // flips each scene
        }
        const w = ART_W * LANE_SCALE;
        const barH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bar-h")) || 64;
        const targetX = laneSide === 1 ? -w * 0.42 : vw - w * 0.58;
        const targetY = vh - barH - ART_H * LANE_SCALE - 4;
        if (!placed) {
          cur.x = targetX + (laneSide === 1 ? -w : w);
          cur.y = targetY;
          cur.s = LANE_SCALE;
          placed = true;
        }
        const k = reduced ? 1 : 1 - Math.exp(-dt * 6);
        cur.x += (targetX - cur.x) * k;
        cur.y += (targetY - cur.y) * k;
        cur.s = LANE_SCALE;
        applyLook("sit", laneSide === 1 ? "right" : "left");
        setActive(null);
        show(inScene);
        settled = Math.abs(targetX - cur.x) < 0.3;
      } else {
        const stop = stops[best];
        const rect: DOMRect = bestRect;
        const targetS = rect.width / ART_W;
        const h = rect.height;
        // While the stop is far off screen the actor waits at the bottom edge, walking toward its column.
        const targetX = Math.min(Math.max(rect.left, -rect.width * 0.2), vw - rect.width * 0.8);
        const targetY = Math.min(Math.max(rect.top, vh * 0.3), vh - h - 24);
        if (!placed) {
          cur.x = targetX;
          cur.y = vh;
          cur.s = targetS;
          placed = true;
        }
        const k = reduced ? 1 : 1 - Math.exp(-dt * 7);
        cur.x += (targetX - cur.x) * k;
        cur.y += (targetY - cur.y) * k;
        cur.s += (targetS - cur.s) * k;

        const dx = rect.left - cur.x;
        const dist = Math.hypot(dx, rect.top - cur.y);
        const arrived = dist < ARRIVED_PX && rect.top >= vh * 0.3 - 1 && rect.bottom <= vh + h;
        if (arrived) applyLook(stop.dataset.pose as TeddyPose, (stop.dataset.facing as "left" | "right") ?? "right");
        else applyLook("walk", dx < -8 ? "left" : "right");
        setActive(stop);

        const last = stop === stops[stops.length - 1];
        show(!(last && rect.bottom < 0));
        settled = dist < 0.4 && Math.abs(cur.s - targetS) < 0.002;
      }

      actor.style.transform = `translate3d(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px, 0) scale(${cur.s.toFixed(3)})`;

      const scrolled = window.scrollY !== lastScroll;
      lastScroll = window.scrollY;
      frame = settled && !scrolled ? 0 : requestAnimationFrame(tick);
      if (!frame) lastTime = 0;
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    wake();

    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      cancelAnimationFrame(frame);
      setActive(null);
      timerSet.forEach(clearTimeout);
      timerSet.clear();
    };
  }, []);

  const later = (fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  };

  const onPet = () => {
    const id = Date.now();
    setBubble(WOOFS[Math.floor(Math.random() * WOOFS.length)]);
    setHearts((list) => [...list.slice(-4), id]);
    later(() => setBubble(null), BUBBLE_MS);
    later(() => setHearts((list) => list.filter((h) => h !== id)), HEART_MS);
  };

  return (
    <div ref={layerRef} className="pup-layer" aria-hidden="true" style={{ opacity: 0 }}>
      <div ref={actorRef} className="pup-actor">
        <button type="button" tabIndex={-1} className="pup-actor__hit" onClick={onPet}>
          <Teddy pose={look.pose} facing={look.facing} className="pup-actor__art" />
        </button>
        {bubble && <span className="pup-bubble font-scrawl">{bubble}</span>}
        {hearts.map((id, i) => (
          <span key={id} className="pup-heart" style={{ left: `${40 + ((i * 23) % 40)}%` }}>
            ♥
          </span>
        ))}
      </div>
    </div>
  );
}
