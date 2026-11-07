import type { ReactNode } from "react";

import { BlurFade } from "@/components/ui/blur-fade";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
};

function MotionReveal({ children, className }: MotionRevealProps) {
  return (
    <BlurFade inView className={className}>
      {children}
    </BlurFade>
  );
}

export { MotionReveal };
