// "Delivery & collection": the four ways a puppy reaches you, beside a plane flying from Korea to Dubai.

import { DubaiSkyline } from "@/components/decor/DubaiSkyline";
import { deliveryOptions } from "@/data/howItWorks";

export function DeliverySection() {
  return (
    <section
      id="delivery"
      aria-labelledby="delivery-title"
      className="mt-24 grid items-center gap-10 lg:grid-cols-12"
    >
      <div className="lg:col-span-6">
        <h2 id="delivery-title" className="font-plush text-huge">
          Delivery &amp; collection
        </h2>
        <p className="text-lede mt-5 text-[var(--ink-soft)]">
          From a same-day visit in Downtown Dubai to a flight from Korea, every puppy travels comfortably and
          arrives safely.
        </p>
        <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {deliveryOptions.map((option) => (
            <li key={option.title}>
              <h3 className="font-plush-text text-[1.3rem] leading-snug font-bold">{option.title}</h3>
              <p className="mt-1.5 text-[var(--ink-soft)]">{option.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative h-[clamp(14rem,30vw,22rem)] lg:col-span-6">
        <DubaiSkyline className="absolute inset-x-0 bottom-0 w-full text-cocoa/25" />
        <FlightScene />
      </div>
    </section>
  );
}

/** Dotted route from Korea to Dubai with a cartoon plane near the end of it. */
function FlightScene() {
  return (
    <svg
      viewBox="0 0 660 300"
      role="img"
      aria-label="A plane flying puppies from Korea to Dubai"
      className="flight"
    >
      <path d="M40 250 C 170 40, 470 20, 620 168" className="flight__route" />
      <circle cx="40" cy="250" r="7" className="flight__dot" />
      <circle cx="620" cy="168" r="7" className="flight__dot" />
      <text x="40" y="284" textAnchor="middle" className="flight__label">
        Korea
      </text>
      <text x="620" y="202" textAnchor="middle" className="flight__label">
        Dubai
      </text>

      {/* The plane is drawn around its own centre; CSS (offset-path) flies it along the route, nose first. */}
      <g className="flight__plane">
        <g transform="translate(-126 -78)">
          <path d="M28 60 L8 26 L34 26 L60 54 Z" className="flight__wing" />
          <path d="M108 112 L142 156 L172 156 L158 112 Z" className="flight__wing flight__wing--far" />
          <path
            d="M20 80 C20 52 52 44 80 44 L168 44 C200 44 224 60 232 80 C224 100 200 112 168 112 L80 112 C52 112 20 104 20 80 Z"
            className="flight__body"
          />
          <path d="M104 44 L138 2 L168 2 L154 44 Z" className="flight__wing" />
          <path d="M206 64 C215 67 221 73 224 80" className="flight__line" />
        </g>
      </g>
    </svg>
  );
}
