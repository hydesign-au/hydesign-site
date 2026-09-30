import { create as createConfetti } from "canvas-confetti";
import type {
  CreateTypes as ConfettiInstance,
  GlobalOptions as ConfettiGlobalOptions,
  Options as ConfettiOptions,
} from "canvas-confetti";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
} from "react";

type ConfettiApi = {
  fire: (options?: ConfettiOptions) => Promise<void>;
};

type ConfettiProps = ComponentPropsWithoutRef<"canvas"> & {
  options?: ConfettiOptions;
  globalOptions?: ConfettiGlobalOptions;
  manualstart?: boolean;
};

export type ConfettiRef = ConfettiApi | null;

const defaultGlobalOptions: ConfettiGlobalOptions = {
  resize: true,
  useWorker: true,
};

const Confetti = forwardRef<ConfettiRef, ConfettiProps>(function Confetti(
  { options, globalOptions = defaultGlobalOptions, manualstart = false, ...canvasProps },
  ref,
) {
  const instanceRef = useRef<ConfettiInstance | null>(null);
  const canvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (node) {
        instanceRef.current ??= createConfetti(node, globalOptions);
        return;
      }

      instanceRef.current?.reset();
      instanceRef.current = null;
    },
    [globalOptions],
  );

  const fire = useCallback(
    async (overrideOptions: ConfettiOptions = {}) => {
      await instanceRef.current?.({ ...options, ...overrideOptions });
    },
    [options],
  );

  useImperativeHandle(ref, () => ({ fire }), [fire]);

  useEffect(() => {
    if (!manualstart) {
      void fire();
    }
  }, [fire, manualstart]);

  return <canvas ref={canvasRef} {...canvasProps} />;
});

export { Confetti };
