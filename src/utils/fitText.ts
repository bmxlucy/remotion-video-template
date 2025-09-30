import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useCurrentScale, useDelayRender } from "remotion";

const DEBOUNCE_MS = 40;
const RETRY_COUNT = 2;
const EPS = 0.002;
const BASE_FONT_SIZE = 16;
const MAX_ITERATIONS = 12;
const FONT_STEP = 0.5;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useFitText(
  contentRef: React.RefObject<HTMLElement | null>,
  width: number,
  height: number,
): number {
  const playerScale = useCurrentScale();
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);
  const retriesRef = useRef(RETRY_COUNT);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const measuringRef = useRef(false);
  const {
    delayRender: requestRenderDelay,
    continueRender: releaseRenderDelay,
  } = useDelayRender();
  const renderHandleRef = useRef<number | null>(null);

  const markMeasured = useCallback(() => {
    if (renderHandleRef.current !== null) {
      releaseRenderDelay(renderHandleRef.current);
      renderHandleRef.current = null;
    }
  }, [releaseRenderDelay]);

  useEffect(() => {
    renderHandleRef.current = requestRenderDelay(
      "useFitText initial measurement",
    );
    return () => {
      if (renderHandleRef.current !== null) {
        releaseRenderDelay(renderHandleRef.current);
        renderHandleRef.current = null;
      }
    };
  }, [requestRenderDelay, releaseRenderDelay]);

  const measure = useCallback(() => {
    const el = contentRef.current;
    if (!el || measuringRef.current) return;
    if (typeof window === "undefined") return;

    const availableWidth = width / playerScale;
    const availableHeight = height / playerScale;
    if (availableWidth <= 0 || availableHeight <= 0) return;

    measuringRef.current = true;
    const previousFontSize = el.style.fontSize;
    const dynamicMax = Math.max(FONT_STEP, availableHeight);
    const previousBestFont = clamp(
      scaleRef.current * BASE_FONT_SIZE,
      FONT_STEP,
      dynamicMax,
    );

    let low = FONT_STEP;
    let high = dynamicMax;
    let best = previousBestFont;
    let foundFit = false;
    let shouldRetry = false;

    try {
      let mid = previousBestFont;

      for (let i = 0; i < MAX_ITERATIONS && low <= high; i += 1) {
        if (i > 0) {
          mid = (low + high) / 2;
        }
        el.style.fontSize = `${mid}px`;

        const measuredWidth = el.scrollWidth / playerScale;
        const measuredHeight = el.scrollHeight / playerScale;

        if (measuredWidth === 0 || measuredHeight === 0) {
          shouldRetry = true;
          break;
        }

        const fitsWidth = measuredWidth <= availableWidth + 0.5;
        const fitsHeight = measuredHeight <= availableHeight + 0.5;

        if (fitsWidth && fitsHeight) {
          foundFit = true;
          best = mid;
          low = mid + FONT_STEP;

          const widthFill = measuredWidth / availableWidth;
          const heightFill = measuredHeight / availableHeight;
          if (Math.abs(widthFill - 1) < EPS && Math.abs(heightFill - 1) < EPS) {
            break;
          }
        } else {
          high = mid - FONT_STEP;
        }
      }
    } finally {
      el.style.fontSize = previousFontSize;
      measuringRef.current = false;
    }

    if (shouldRetry) {
      if (retriesRef.current > 0) {
        retriesRef.current -= 1;
        if (typeof requestAnimationFrame === "function") {
          rafRef.current = requestAnimationFrame(measure);
        }
      } else {
        retriesRef.current = RETRY_COUNT;
        markMeasured();
      }
      return;
    }

    retriesRef.current = RETRY_COUNT;

    const fallbackFont = Math.min(high, best);
    const clampedFont = foundFit
      ? best
      : clamp(fallbackFont, FONT_STEP, dynamicMax);
    const unclampedScale =
      Math.max(clampedFont, Number.EPSILON) / BASE_FONT_SIZE;
    const nextScale = clamp(unclampedScale, 0, 1);

    scaleRef.current = nextScale;
    setScale((prev) => (Math.abs(nextScale - prev) > EPS ? nextScale : prev));
    markMeasured();
  }, [contentRef, width, height, playerScale, markMeasured]);

  const schedule = useCallback(() => {
    if (typeof window === "undefined") return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (typeof requestAnimationFrame === "function") {
        rafRef.current = requestAnimationFrame(measure);
      } else {
        measure();
      }
    }, DEBOUNCE_MS);
  }, [measure]);

  useIsomorphicLayoutEffect(() => {
    schedule();
  }, [width, height, schedule]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || typeof window === "undefined") return;

    const disposers: Array<() => void> = [];

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => schedule());
      ro.observe(el);
      disposers.push(() => ro.disconnect());
    }

    if ("MutationObserver" in window) {
      const mo = new MutationObserver(() => schedule());
      mo.observe(el, {
        characterData: true,
        childList: true,
        subtree: true,
      });
      disposers.push(() => mo.disconnect());
    }

    schedule();
    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, [contentRef, schedule]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      debounceRef.current = null;
      rafRef.current = null;
    },
    [],
  );

  return scale;
}
