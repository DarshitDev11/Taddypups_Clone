// PLACEHOLDER for the route "curtain": a honey blanket with a lattice and scalloped edges that covers the
// screen with a running puppy during navigation. Renders nothing yet.
//
// TODO (see research/DESIGN-SPEC.md section 2.9):
//  - first load: cover, then lift after ~0.56s (overlay gone at ~1.04s)
//  - link click: cover (0.3s) -> router.push -> lift (0.46s)
//  - ignore new-tab links, modified clicks, same-page hash links and /admin|/api|/_next
// It is mounted once in app/layout.tsx, so it can stay a standalone client component.

export function PageTransition() {
  return null;
}
