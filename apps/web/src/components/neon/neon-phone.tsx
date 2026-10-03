import { cn } from "@hydesign/ui/lib/utils";
import { type ComponentProps } from "react";

import styles from "./neon.module.css";

type Shape = { d: string } | { cx: number; cy: number; r: number };

type Tube = {
  id: string;
  strokeWidth: number;
  shapes: Shape[];
  weak?: boolean;
};

const dialCentre = { cx: 200, cy: 192 };

// Clockwise from the top of the dial.
const fingerHoleCentres: [number, number][] = [
  [200, 151],
  [224.1, 158.8],
  [239, 179.3],
  [239, 204.7],
  [224.1, 225.2],
  [200, 233],
  [175.9, 225.2],
  [161, 204.7],
  [161, 179.3],
  [175.9, 158.8],
];

// The complete sign stays lit; only the handset occasionally falters.
const tubes: Tube[] = [
  {
    id: "body",
    strokeWidth: 6,
    shapes: [
      {
        d: "M 88 262 C 78 262 72 256 74 246 L 96 165 C 104 135 125 118 155 115 L 245 115 C 275 118 296 135 304 165 L 326 246 C 328 256 322 262 312 262 Z",
      },
      { d: "M 130 115 V 84 Q 130 76 138 76 H 156 Q 164 76 164 84 V 115" },
      { d: "M 236 115 V 84 Q 236 76 244 76 H 262 Q 270 76 270 84 V 115" },
    ],
  },
  {
    id: "handset",
    strokeWidth: 6,
    weak: true,
    shapes: [
      {
        d: "M 48 96 C 36 78 44 52 74 46 C 150 30 250 30 326 46 C 356 52 364 78 352 96 C 344 108 322 110 312 100 C 302 90 296 78 284 72 C 230 62 170 62 116 72 C 104 78 98 90 88 100 C 78 110 56 108 48 96 Z",
      },
    ],
  },
  {
    id: "dial",
    strokeWidth: 6,
    shapes: [
      { ...dialCentre, r: 58 },
      { ...dialCentre, r: 22 },
    ],
  },
  ...fingerHoleCentres.map(([cx, cy], index): Tube => ({
    id: `finger-hole-${index}`,
    strokeWidth: 4,
    shapes: [{ cx, cy, r: 7 }],
  })),
];

function NeonPhone({ className, ...props }: ComponentProps<"div">) {
  return (
    <div aria-hidden="true" className={cn(styles.phone, className)} {...props}>
      <span className={styles.spill} />
      <PhoneTubes layer="glass" />
      <PhoneTubes layer="bloom" />
      <PhoneTubes layer="lit" />
    </div>
  );
}

// Three copies of the drawing: the unlit glass, a thick blurred copy that throws the glow, and
// the lit tubes with their hot cores.
function PhoneTubes({ layer }: { layer: "glass" | "bloom" | "lit" }) {
  return (
    <svg
      viewBox="-40 -10 480 320"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles[layer]}
    >
      {tubes.map((tube) => {
        if (layer === "glass") {
          return <TubeShapes key={tube.id} shapes={tube.shapes} strokeWidth={tube.strokeWidth} />;
        }

        return (
          <g key={tube.id} data-weak={tube.weak || undefined}>
            {layer === "bloom" ? (
              <TubeShapes
                shapes={tube.shapes}
                strokeWidth={tube.strokeWidth * 4.5}
                className={styles.tube}
              />
            ) : (
              <>
                <TubeShapes
                  shapes={tube.shapes}
                  strokeWidth={tube.strokeWidth}
                  className={styles.tube}
                />
                <TubeShapes
                  shapes={tube.shapes}
                  strokeWidth={tube.strokeWidth * 0.4}
                  className={styles.core}
                />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function TubeShapes({
  shapes,
  strokeWidth,
  className,
}: {
  shapes: Shape[];
  strokeWidth: number;
  className?: string;
}) {
  return (
    <g className={className} strokeWidth={strokeWidth}>
      {shapes.map((shape) =>
        "d" in shape ? (
          <path key={shape.d} d={shape.d} />
        ) : (
          <circle key={`${shape.cx} ${shape.cy} ${shape.r}`} {...shape} />
        ),
      )}
    </g>
  );
}

export { NeonPhone };
