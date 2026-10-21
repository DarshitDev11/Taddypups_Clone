"use client";

// Toffee paw prints that follow the mouse and fade away. Mouse pointers only; renders one canvas.

import { useEffect, useRef } from "react";

const PAW_PATH =
  "M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z";

const STEP_PX = 46;
const MAX_PRINTS = 14;
const SOLID_MS = 600;
const FADE_MS = 400;
const ALPHA = 0.42;
const SCALE = 0.27;
const SIDE_OFFSET = 7;
const POINTER_OFFSET = { x: 14, y: 16 };

interface Print {
  x: number;
  y: number;
  angle: number;
  born: number;
}

export function PawTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canMouse || reduced || !canvas || !ctx) return;

    const paw = new Path2D(PAW_PATH);
    const prints: Print[] = [];
    let last: { x: number; y: number } | null = null;
    let side = 1;
    let frame = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      while (prints.length && now - prints[0].born > SOLID_MS + FADE_MS) prints.shift();
      for (const print of prints) {
        const age = now - print.born;
        const fade = age <= SOLID_MS ? 1 : 1 - (age - SOLID_MS) / FADE_MS;
        ctx.save();
        ctx.globalAlpha = ALPHA * fade;
        ctx.fillStyle = "#c2622b";
        ctx.translate(print.x, print.y);
        ctx.rotate(print.angle);
        ctx.scale(SCALE, SCALE);
        ctx.translate(-32, -32);
        ctx.fill(paw);
        ctx.restore();
      }
      frame = prints.length ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const point = { x: event.clientX, y: event.clientY };
      if (!last) {
        last = point;
        return;
      }
      const dx = point.x - last.x;
      const dy = point.y - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist < STEP_PX) return;

      const heading = Math.atan2(dy, dx);
      side = -side;
      // Alternate left/right of the path, like footsteps.
      const nx = -Math.sin(heading) * SIDE_OFFSET * side;
      const ny = Math.cos(heading) * SIDE_OFFSET * side;
      prints.push({
        x: point.x + POINTER_OFFSET.x + nx,
        y: point.y + POINTER_OFFSET.y + ny,
        angle: heading + Math.PI / 2,
        born: performance.now(),
      });
      if (prints.length > MAX_PRINTS) prints.shift();
      last = point;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]" />;
}
