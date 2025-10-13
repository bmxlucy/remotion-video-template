import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { useRenderBlocker } from "./useRenderBlocker";

export const useLineSegments = (text: string) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [lineSegments, setLineSegments] = useState<string[]>([]);
  const { startDelay, markReady } = useRenderBlocker("useLineSegments measure");

  const measure = useCallback(() => {
    const el = textRef.current;
    if (!el) return markReady();

    const textNode = Array.from(el.childNodes).find(
      (node): node is Text => node.nodeType === Node.TEXT_NODE,
    );

    if (!textNode?.textContent) {
      setLineSegments([]);
      return markReady();
    }

    const range = document.createRange();
    const textContent = textNode.textContent;
    const segments: string[] = [];
    let currentTop: number | null = null;
    let startIdx = 0;

    for (let i = 0; i < textContent.length; i++) {
      range.setStart(textNode, i);
      range.setEnd(textNode, i + 1);
      const rect = range.getBoundingClientRect();
      if (!rect.width && !rect.height) continue;

      if (currentTop === null) currentTop = rect.top;
      else if (Math.abs(rect.top - currentTop) > 0.5) {
        segments.push(textContent.slice(startIdx, i));
        startIdx = i;
        currentTop = rect.top;
      }
    }
    segments.push(textContent.slice(startIdx));

    setLineSegments((prev) =>
      prev.length === segments.length && prev.every((s, i) => s === segments[i])
        ? prev
        : segments,
    );

    markReady();
  }, [markReady]);

  useLayoutEffect(() => {
    startDelay();
    requestAnimationFrame(() => requestAnimationFrame(measure));
  }, [text, measure, startDelay]);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(measure);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  return { textRef, lineSegments };
};
