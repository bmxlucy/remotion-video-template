import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { getContrastColor } from "../utils/colors";
import { useLineSegments } from "../hooks/useLineSegments";
import { FONT_FAMILY, HIGHLIGHT_COLOR } from "./constants";

const TEXT_ENTRANCE_DURATION = 10;
const WIPE_DURATION = 20;

const containerStyle: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  fontWeight: "500",
  lineHeight: 1.0,
  fontSize: "2.25em",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  position: "absolute",
  top: 0,
  left: 0,
};

const linesWrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "100%",
};

const lineStyle: React.CSSProperties = {
  display: "block",
  padding: "0.33em 0.66em",
  margin: "0.0625em",
  borderRadius: "0.333em",
  wordWrap: "break-word",
  maxWidth: "100%",
};

const initialLinesWrapperStyle: React.CSSProperties = {
  ...linesWrapperStyle,
  position: "absolute",
  color: HIGHLIGHT_COLOR,
};

const measureTextStyle: React.CSSProperties = {
  ...lineStyle,
  visibility: "hidden",
  position: "absolute",
};

export const Highlight: React.FC<{
  readonly text: string;
  readonly bgColor: string;
  readonly delay: number;
  readonly duration: number;
  readonly static?: boolean;
}> = ({ text, bgColor, delay, duration, static: isStatic = false }) => {
  const videoConfig = useVideoConfig();
  const { fps } = videoConfig;
  const frame = useCurrentFrame();
  const adjustedFrame = frame - delay;

  const { textRef, lineSegments } = useLineSegments(text);

  const textEntranceOpacity = spring({
    fps,
    frame: adjustedFrame,
    durationInFrames: TEXT_ENTRANCE_DURATION,
    config: { damping: 200 },
  });

  const textEntranceY = spring({
    fps,
    frame: adjustedFrame,
    from: 40,
    to: 0,
    durationInFrames: TEXT_ENTRANCE_DURATION,
    config: { damping: 200 },
  });

  const opacity =
    duration === Infinity || adjustedFrame < duration ? textEntranceOpacity : 0;

  const wipePerLine = useMemo(
    () => WIPE_DURATION / Math.max(lineSegments.length, 1),
    [lineSegments.length],
  );

  const textColor = getContrastColor(bgColor);

  return (
    <div
      style={{
        ...containerStyle,
        position: isStatic ? "static" : "absolute",
        opacity,
        transform: `translateY(${textEntranceY}px)`,
      }}
    >
      <div ref={textRef} style={measureTextStyle}>
        {text}
      </div>

      <div style={initialLinesWrapperStyle}>
        {lineSegments.map((segment, i) => (
          <span key={i} style={lineStyle}>
            {segment}
          </span>
        ))}
      </div>

      <div style={linesWrapperStyle}>
        {lineSegments.map((segment, i) => {
          const progress = spring({
            fps,
            frame: adjustedFrame - TEXT_ENTRANCE_DURATION - i * wipePerLine,
            durationInFrames: wipePerLine,
            config: { damping: 200 },
          });

          return (
            <span
              key={i}
              style={{
                ...lineStyle,
                backgroundColor: bgColor,
                color: textColor,
                clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
              }}
            >
              {segment}
            </span>
          );
        })}
      </div>
    </div>
  );
};
