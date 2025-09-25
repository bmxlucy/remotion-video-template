import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fitTextOnNLines } from "@remotion/layout-utils";
import { FONT_FAMILY, TITLE_COLOR } from "./constants";

const maxFontSize = 120;
const fontWeight = "600";
const letterSpacing = "-0.02em";

const titleStyle: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  color: TITLE_COLOR,
  fontWeight,
  letterSpacing,
  lineHeight: "1.06",
  marginBottom: "40px",
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

  const fontSize = fitTextOnNLines({
    text: titleText,
    maxBoxWidth: videoConfig.width * 0.9,
    maxLines: 2,
    fontFamily: FONT_FAMILY,
    fontWeight,
    letterSpacing,
    maxFontSize,
    validateFontIsLoaded: true,
  }).fontSize;

  return (
    <h1
      style={{
        ...titleStyle,
        fontSize,
        opacity,
        transform: `translateY(${translateY}px)`,
        maxWidth: videoConfig.width * 0.9,
      }}
    >
      {titleText}
    </h1>
  );
};
