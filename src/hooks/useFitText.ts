import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useRenderBlocker } from "./useRenderBlocker";

const DEBOUNCE_MS = 40;
const EPS = 0.002;
const BASE_FONT_SIZE = 16;
const MAX_ITER = 12;
const FONT_STEP = 0.5;

const useIsoLayout =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const normalizeScale = (value: number) =>
  Math.abs(value - 1) < 0.002 ? 1 : parseFloat(value.toFixed(3));

export function useFitText(
  contentRef: React.RefObject<HTMLElement | null>,
  width: number,
  height: number,
): number {
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { startDelay, markReady } = useRenderBlocker("useFitText measure");

  const measure = useCallback(() => {
    const el = contentRef.current;
    if (!el || typeof window === "undefined") return markReady();

    const availableW = width;
    const availableH = height;
    if (availableW <= 0 || availableH <= 0) return markReady();

    const prevFont = el.style.fontSize;
    let low = FONT_STEP;
    let high = Math.min(BASE_FONT_SIZE, availableH);
    let best = scaleRef.current * BASE_FONT_SIZE;

    for (let i = 0; i < MAX_ITER && low <= high; i++) {
      const mid = (low + high) / 2;
      el.style.fontSize = `${mid}px`;
      const mw = el.scrollWidth;
      const mh = el.scrollHeight;
      if (!mw || !mh) break;

      if (mw <= availableW && mh <= availableH) {
        best = mid;
        low = mid + FONT_STEP;
      } else {
        high = mid - FONT_STEP;
      }
    }

    el.style.fontSize = prevFont;

    const clamped = Math.min(Math.max(best, FONT_STEP), BASE_FONT_SIZE);
    const nextScale = normalizeScale(Math.min(clamped / BASE_FONT_SIZE, 1));

    scaleRef.current = nextScale;
    if (Math.abs(nextScale - scale) > EPS) setScale(nextScale);

    markReady();
  }, [contentRef, width, height, scale, markReady]);

  const schedule = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(measure, DEBOUNCE_MS);
  }, [measure]);

  useIsoLayout(() => {
    startDelay();
    requestAnimationFrame(schedule);
  }, [width, height, schedule, startDelay]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(schedule);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [schedule, contentRef]);

  return scale;
}
