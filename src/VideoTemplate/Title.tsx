import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_FAMILY, TITLE_COLOR } from "./constants";

const titleStyle: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  color: TITLE_COLOR,
  fontSize: "7.5em",
  fontWeight: "600",
  letterSpacing: "-0.02em",
  lineHeight: 1.06,
  margin: "0px",
  maxWidth: "100%",
  wordWrap: "break-word",
};

export const Title: React.FC<{
  readonly titleText: string;
  readonly delay?: number;
}> = ({ titleText, delay = 0 }) => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();
  const durationInFrames = 20;

  const opacity = spring({
    fps: videoConfig.fps,
    frame,
    delay,
    durationInFrames,
    config: {
      damping: 200,
    },
  });

  const translateY = spring({
    fps: videoConfig.fps,
    frame,
    delay,
    from: 40,
    to: 0,
    durationInFrames,
    config: {
      damping: 200,
    },
  });

  return (
    <h1
      style={{
        ...titleStyle,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {titleText}
    </h1>
  );
};
