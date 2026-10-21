// Illustration for "Imported for you": a dotted flight route from Korea to Dubai with a plane carrying a puppy.

interface FlightPathProps {
  /** Photo shown in the plane's porthole. */
  puppySrc: string;
}

// Route as a cubic curve; the plane is parked at about 80% of it, nose along the curve.
const ROUTE = "M40 250 C 170 40, 470 20, 620 168";
const PLANE_AT = "translate(520 112) rotate(30)";

export function FlightPath({ puppySrc }: FlightPathProps) {
  return (
    <svg
      viewBox="0 0 660 300"
      role="img"
      aria-label="A plane bringing a Korean teacup puppy from Korea to Dubai"
      className="home-flight"
    >
      <defs>
        <clipPath id="home-flight-porthole">
          <circle r="25" />
        </clipPath>
      </defs>

      <path d={ROUTE} className="home-flight__route" />
      <circle cx="40" cy="250" r="7" className="home-flight__dot" />
      <circle cx="620" cy="168" r="7" className="home-flight__dot" />
      <text x="40" y="284" textAnchor="middle" className="home-flight__label">
        Korea
      </text>
      <text x="620" y="202" textAnchor="middle" className="home-flight__label">
        Dubai
      </text>

      <g transform={PLANE_AT}>
        {/* The inner group bobs; the outer one only places the plane. */}
        <g className="home-flight__plane">
          <g transform="translate(-126 -78)">
            <path d="M28 60 L8 26 L34 26 L60 54 Z" className="home-flight__wing" />
            <path d="M108 112 L142 156 L172 156 L158 112 Z" className="home-flight__wing home-flight__wing--far" />
            <path
              d="M20 80 C20 52 52 44 80 44 L168 44 C200 44 224 60 232 80 C224 100 200 112 168 112 L80 112 C52 112 20 104 20 80 Z"
              className="home-flight__body"
            />
            <path d="M104 44 L138 2 L168 2 L154 44 Z" className="home-flight__wing" />
            <path d="M206 64 C215 67 221 73 224 80" className="home-flight__line" />
          </g>
          <g transform="translate(10 2)">
            <image
              href={puppySrc}
              x="-25"
              y="-25"
              width="50"
              height="50"
              clipPath="url(#home-flight-porthole)"
              preserveAspectRatio="xMidYMid slice"
            />
            <circle r="25" className="home-flight__porthole" />
          </g>
        </g>
      </g>
    </svg>
  );
}
