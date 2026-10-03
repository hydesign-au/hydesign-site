import { motion, useReducedMotion } from "motion/react";

import { NeonText } from "@/components/neon/neon-text";
import type { TitleTreatment } from "@/content/services/types";

type ExpressiveHeadingProps = {
  title: string;
  treatment?: TitleTreatment;
};

const threeDShadow = [
  "-0.012em 0.012em 0 color-mix(in oklab, var(--photo-foreground) 88%, var(--photo-scrim))",
  "-0.024em 0.024em 0 color-mix(in oklab, var(--photo-foreground) 80%, var(--photo-scrim))",
  "-0.036em 0.036em 0 color-mix(in oklab, var(--photo-foreground) 72%, var(--photo-scrim))",
  "-0.048em 0.048em 0 color-mix(in oklab, var(--photo-foreground) 64%, var(--photo-scrim))",
  "-0.06em 0.06em 0 color-mix(in oklab, var(--photo-foreground) 56%, var(--photo-scrim))",
  "-0.072em 0.072em 0 color-mix(in oklab, var(--photo-foreground) 48%, var(--photo-scrim))",
  "-0.084em 0.084em 0 color-mix(in oklab, var(--photo-foreground) 40%, var(--photo-scrim))",
  "-0.096em 0.096em 0 color-mix(in oklab, var(--photo-foreground) 32%, var(--photo-scrim))",
  "-0.108em 0.108em 0 color-mix(in oklab, var(--photo-foreground) 24%, var(--photo-scrim))",
  "-0.118em 0.118em 0.035em color-mix(in oklab, var(--photo-scrim) 70%, transparent)",
  "var(--photo-text-shadow)",
].join(", ");

function ExpressiveHeading({ title, treatment }: ExpressiveHeadingProps) {
  if (!treatment || !title.includes(treatment.accent)) return title;

  const accentStart = title.indexOf(treatment.accent);
  const before = title.slice(0, accentStart);
  const after = title.slice(accentStart + treatment.accent.length);

  return (
    <>
      {before}
      <TitleAccent effect={treatment.effect}>{treatment.accent}</TitleAccent>
      {after}
    </>
  );
}

function TitleAccent({ children, effect }: { children: string; effect: TitleTreatment["effect"] }) {
  switch (effect) {
    case "3d":
      return <ThreeDAccent>{children}</ThreeDAccent>;
    case "brush":
      return <BrushAccent>{children}</BrushAccent>;
    case "neon":
      return <NeonAccent>{children}</NeonAccent>;
    default: {
      const exhaustive: never = effect;
      return exhaustive;
    }
  }
}

function ThreeDAccent({ children }: { children: string }) {
  return (
    <span className="inline-block pr-[0.04em]" style={{ textShadow: threeDShadow }}>
      {children}
    </span>
  );
}

function BrushAccent({ children }: { children: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="relative inline-block">
      {children}
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-[0.05em] -bottom-[0.14em] -left-[0.05em] h-[0.2em] w-[calc(100%+0.1em)] text-primary"
        preserveAspectRatio="none"
        viewBox="0 0 180 18"
      >
        <motion.path
          d="M3 10.5C34 5.2 65 7.4 93 8.2c28 .8 53-4.4 84-2.3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            delay: reduceMotion ? 0 : 0.18,
            duration: reduceMotion ? 0 : 0.9,
            ease: "easeOut",
          }}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="5.2"
        />
        <motion.path
          d="M8 14.3c29-3.1 61-2.1 86-2.6 31-.6 54-3 75-2.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            delay: reduceMotion ? 0 : 0.24,
            duration: reduceMotion ? 0 : 0.8,
            ease: "easeOut",
          }}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
}

function NeonAccent({ children }: { children: string }) {
  return <NeonText color="var(--primary)">{children}</NeonText>;
}

export { ExpressiveHeading };
