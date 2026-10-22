"use client";

// Route "curtain": a honey blanket with a lattice and scalloped edges that covers the screen while a
// puppy runs across it. Plays once on first load and again on every internal link click.
// Spec: research/DESIGN-SPEC.md section 2.9. It is mounted once in app/layout.tsx.

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

type CurtainState = "intro" | "idle" | "covering" | "covered" | "lifting";

// Timings from the original site (ms).
const INTRO_MS = 1040;
const COVER_MS = 300;
const LIFT_MS = 460;
/** How long a client-side navigation may take before falling back to a full page load. */
const FALLBACK_MS = 1500;

// Links the curtain must never intercept.
const IGNORED_PREFIXES = ["/admin", "/api", "/media", "/_next"];

const PAW_PRINTS = [0, 1, 2, 3, 4];

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Returns the internal path to navigate to, or null if this click should behave normally. */
function getInterceptablePath(event: MouseEvent): string | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;

  const anchor = (event.target as Element | null)?.closest?.("a");
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return null;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (IGNORED_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) return null;
  // Same-page anchors smooth-scroll instead.
  if (url.hash && url.pathname === window.location.pathname) return null;

  return url.pathname + url.search + url.hash;
}

export function PageTransition({ runner }: { runner: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<CurtainState>("intro");
  const timer = useRef<number | undefined>(undefined);
  const fallback = useRef<number | undefined>(undefined);

  const after = (ms: number, fn: () => void) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(fn, ms);
  };

  // First load: the blanket starts down and lifts by itself.
  useEffect(() => {
    after(prefersReducedMotion() ? 0 : INTRO_MS, () => setState("idle"));
    return () => window.clearTimeout(timer.current);
  }, []);

  // Intercept internal link clicks: cover first, then navigate.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const path = getInterceptablePath(event);
      if (!path || prefersReducedMotion()) return;

      event.preventDefault();
      if (path === window.location.pathname) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setState("covering");
      after(COVER_MS, () => {
        setState("covered");
        router.push(path);
        // Safety net: if the client-side navigation stalls or never starts, do a normal page load instead
        // of leaving the visitor on the same page with the curtain down.
        window.clearTimeout(fallback.current);
        fallback.current = window.setTimeout(() => {
          if (window.location.pathname + window.location.search !== path.split("#")[0]) window.location.assign(path);
        }, FALLBACK_MS);
      });
    };
    // Capture phase so we run before Next's <Link> handler.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // Arriving at the new page cancels the safety net.
  useEffect(() => {
    window.clearTimeout(fallback.current);
  }, [pathname]);

  // The new page has rendered: lift the blanket. (Only acts if this path change came from a covered
  // navigation; the state check is done in the timer so the effect itself never sets state.)
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  useEffect(() => {
    if (stateRef.current !== "covered") return;
    after(0, () => {
      window.scrollTo(0, 0);
      setState("lifting");
      after(LIFT_MS, () => setState("idle"));
    });
  }, [pathname]);

  // Lock page scroll while the curtain is down.
  useEffect(() => {
    const hold = state === "intro" || state === "covering" || state === "covered";
    document.documentElement.classList.toggle("tp-hold-still", hold);
  }, [state]);

  return (
    <div className="tp-curtain" data-state={state} aria-hidden="true">
      <div className="tp-curtain__blanket">
        <div className="tp-curtain__stage">
          <div className="tp-curtain__runner">{runner}</div>
          {PAW_PRINTS.map((i) => (
            <span key={i} className="tp-curtain__print" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
        <p className="tp-curtain__caption">every puppy is family</p>
      </div>
    </div>
  );
}
