import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { getContrastColor } from "../utils/colors";
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

const textBaseStyle: React.CSSProperties = {
  padding: "0.33em 0.66em",
  maxWidth: "100%",
  wordWrap: "break-word",
};

const highlightTextStyle: React.CSSProperties = {
  ...textBaseStyle,
  color: HIGHLIGHT_COLOR,
  position: "absolute",
};

const backgroundTextStyle: React.CSSProperties = {
  ...textBaseStyle,
  position: "relative",
  justifyContent: "center",
  height: "100%",
  borderRadius: "0.333em",
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

  const wipeProgress = spring({
    fps,
    frame: adjustedFrame - TEXT_ENTRANCE_DURATION,
    durationInFrames: WIPE_DURATION,
    config: { damping: 200 },
  });

  const opacity =
    duration === Infinity || adjustedFrame < duration ? textEntranceOpacity : 0;

  return (
    <div
      style={{
        ...containerStyle,
        position: isStatic ? "static" : "absolute",
        opacity,
        transform: `translateY(${textEntranceY}px)`,
      }}
    >
      <div style={highlightTextStyle}>{text}</div>

      <div
        style={{
          ...backgroundTextStyle,
          backgroundColor: bgColor,
          clipPath: `inset(0 ${100 - wipeProgress * 100}% 0 0)`,
          color: getContrastColor(bgColor),
        }}
      >
        {text}
      </div>
    </div>
  );
};
