import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { BlurFade } from "@/components/ui/blur-fade";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
};

function MotionReveal({ children, className }: MotionRevealProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <BlurFade inView className={className}>
      {children}
    </BlurFade>
  );
}

export { MotionReveal };
