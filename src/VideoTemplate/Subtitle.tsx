import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_FAMILY, SUBTITLE_COLOR } from "./constants";

const subtitleStyle: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  color: SUBTITLE_COLOR,
  fontSize: "2.5em",
  fontWeight: "400",
  letterSpacing: "-0.02em",
  lineHeight: 1.2,
  maxWidth: "100%",
  paddingTop: "1em",
  paddingBottom: "1.5em",
  wordWrap: "break-word",
};

export const Subtitle: React.FC<{
  readonly subTitleText: string;
  readonly delay?: number;
}> = ({ subTitleText, delay = 0 }) => {
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
    <div
      style={{
        ...subtitleStyle,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {subTitleText}
    </div>
  );
};
