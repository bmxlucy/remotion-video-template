import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fitTextOnNLines } from "@remotion/layout-utils";
import { FONT_FAMILY, SUBTITLE_COLOR } from "./constants";

const maxFontSize = 40;
const fontWeight = "400";
const letterSpacing = "-0.02em";

const subtitleStyle: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  color: SUBTITLE_COLOR,
  fontWeight,
  letterSpacing,
  lineHeight: "1.2",
  marginBottom: "60px",
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

  const fontSize = fitTextOnNLines({
    text: subTitleText,
    maxBoxWidth: videoConfig.width * 0.9,
    maxLines: 3,
    fontFamily: FONT_FAMILY,
    fontWeight,
    letterSpacing,
    maxFontSize,
    validateFontIsLoaded: true,
  }).fontSize;

  return (
    <div
      style={{
        ...subtitleStyle,
        fontSize,
        opacity,
        transform: `translateY(${translateY}px)`,
        maxWidth: videoConfig.width * 0.9,
      }}
    >
      {subTitleText}
    </div>
  );
};
