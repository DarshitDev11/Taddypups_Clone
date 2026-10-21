// The running-puppy illustration used by the route curtain. It is a server component that inlines
// the SVG (instead of <img>) so CSS can animate its legs, ears and tail by class name.

import { readFileSync } from "node:fs";
import path from "node:path";

const svg = readFileSync(path.join(process.cwd(), "public/svg/curtain-runner.svg"), "utf8");

export function CurtainRunner() {
  return <span className="contents" dangerouslySetInnerHTML={{ __html: svg }} />;
}
