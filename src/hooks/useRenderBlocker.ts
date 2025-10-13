import { useEffect, useRef, useCallback } from "react";
import { useDelayRender } from "remotion";

export const useRenderBlocker = (label: string) => {
  const { delayRender, continueRender } = useDelayRender();
  const handleRef = useRef<number | null>(null);

  const startDelay = useCallback(() => {
    if (handleRef.current === null) {
      handleRef.current = delayRender(label);
    }
  }, [delayRender, label]);

  const markReady = useCallback(() => {
    if (handleRef.current !== null) {
      continueRender(handleRef.current);
      handleRef.current = null;
    }
  }, [continueRender]);

  useEffect(() => {
    return () => {
      if (handleRef.current !== null) {
        continueRender(handleRef.current);
      }
    };
  }, [continueRender]);

  return { startDelay, markReady };
};
