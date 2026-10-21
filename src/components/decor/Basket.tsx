// Wicker basket with Teddy curled up inside; sits in the footer. Layers: back rim, Teddy, front weave.

import { Teddy } from "./Teddy";

export function Basket() {
  return (
    <div className="basket">
      {/* Back of the basket: the dark hollow and the far half of the rim. */}
      <svg aria-hidden="true" viewBox="0 0 300 240" className="basket__back">
        <ellipse cx="212" cy="145" rx="96" ry="12" className="basket__hollow" />
        <path d="M116 145 A96 12 0 0 1 308 145" className="basket__rim-line" />
        <path d="M116 145 A96 12 0 0 1 308 145" className="basket__rim" />
      </svg>

      <div className="basket__pup">
        <Teddy pose="snug" label="Teddy, sitting snug in his basket" />
      </div>

      {/* Front of the basket: woven body that hides Teddy's lower half. */}
      <svg aria-hidden="true" viewBox="0 0 300 240" className="basket__front">
        <path
          d="M116 145 C118 180 126 214 138 232 L286 232 C298 214 306 180 308 145 A96 12 0 0 1 116 145 Z"
          className="basket__body"
        />
        <path d="M121 178 Q212 197 303 178 M127 206 Q212 223 297 206" className="basket__weave" />
        <path
          d="M150 164 L158 230 M182 168 L185 232 M212 169 V232 M242 168 L239 232 M274 164 L266 230"
          className="basket__weave basket__weave--stakes"
        />
        <path d="M116 145 A96 12 0 0 0 308 145" className="basket__rim-line" />
        <path d="M116 145 A96 12 0 0 0 308 145" className="basket__rim" />
      </svg>
    </div>
  );
}
