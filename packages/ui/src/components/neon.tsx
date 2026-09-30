"use client";

import { cn } from "@hydesign/ui/lib/utils";
import * as React from "react";

export type NeonIntensity = "subtle" | "default" | "strong";
export type NeonSpread = "tight" | "default" | "wide";
export type NeonFlicker = "none" | "startup";
export type NeonTrigger = "in-view" | "mount" | "manual";

export interface NeonProps extends Omit<React.ComponentPropsWithoutRef<"span">, "color"> {
  /** Required design token or CSS colour used by the glow. */
  color: string;
  intensity?: NeonIntensity;
  spread?: NeonSpread;
  flicker?: NeonFlicker;
  trigger?: NeonTrigger;
  /** Used only when trigger="manual". */
  active?: boolean;
  /** Remain on after the first viewport entry. */
  once?: boolean;
  /** IntersectionObserver threshold from 0 to 1. */
  amount?: number;
  /** Delay before ignition begins, in milliseconds. */
  delay?: number;
  /** Ignition animation duration, in milliseconds. */
  duration?: number;
  /** Render a broad reflected-light bloom behind the source. */
  ambient?: boolean;
}

type NeonStyle = React.CSSProperties & {
  "--neon-color"?: string;
  "--neon-delay"?: string;
  "--neon-duration"?: string;
};

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) ref.current = value;
}

const Neon = React.forwardRef<HTMLSpanElement, NeonProps>(function Neon(
  {
    color,
    intensity = "default",
    spread = "default",
    flicker = "startup",
    trigger = "in-view",
    active = false,
    once = true,
    amount = 0.35,
    delay = 0,
    duration = 1_150,
    ambient = true,
    className,
    style,
    children,
    ...props
  },
  forwardedRef,
) {
  const rootRef = React.useRef<HTMLSpanElement>(null);
  const [observedActive, setObservedActive] = React.useState(false);

  const setRootRef = React.useCallback(
    (node: HTMLSpanElement | null) => {
      rootRef.current = node;
      assignRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  React.useEffect(() => {
    if (trigger !== "in-view") return;

    const node = rootRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) return;

    const threshold = Math.min(1, Math.max(0, amount));
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setObservedActive(true);
          if (once) observer.disconnect();
          return;
        }

        if (!once) setObservedActive(false);
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [amount, once, trigger]);

  const observerUnavailable = typeof window !== "undefined" && !("IntersectionObserver" in window);
  const isActive =
    trigger === "manual" ? active : trigger === "mount" || observedActive || observerUnavailable;
  const neonStyle: NeonStyle = {
    ...style,
    "--neon-color": color,
    "--neon-delay": `${Math.max(0, delay)}ms`,
    "--neon-duration": `${Math.max(0, duration)}ms`,
  };

  return (
    <span
      ref={setRootRef}
      data-slot="neon"
      data-state={isActive ? "on" : "off"}
      data-intensity={intensity}
      data-spread={spread}
      data-flicker={flicker}
      data-ambient={ambient ? "true" : "false"}
      className={cn("neon", className)}
      style={neonStyle}
      {...props}
    >
      <span data-slot="neon-source">{children}</span>
    </span>
  );
});

export { Neon };
