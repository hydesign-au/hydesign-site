import { BlurFade } from "@hydesign/ui/components/blur-fade";
import type { ReactNode } from "react";

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
