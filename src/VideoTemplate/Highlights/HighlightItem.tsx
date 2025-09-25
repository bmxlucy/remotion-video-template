import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fitTextOnNLines } from "@remotion/layout-utils";
import { getContrastColor } from "../../utils/colors";
import { FONT_FAMILY, HIGHLIGHT_COLOR } from "../constants";

const fontWeight = "500";
const maxFontSize = 36;
const paddingInline = 24;

const containerStyle: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  fontWeight,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
};

const baseLayerStyle: React.CSSProperties = {
  color: HIGHLIGHT_COLOR,
  position: "absolute",
};

const overlayLayerStyle: React.CSSProperties = {
  paddingInline: `${paddingInline}px`,
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  borderRadius: "12px",
};

export const HighlightItem: React.FC<{
  readonly text: string;
  readonly bgColor: string;
}> = ({ text, bgColor }) => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();

  // Step A: Text-only entrance (frames 0-10)
  const textEntranceDurationInFrames = 10;

  const textEntranceOpacity = spring({
    fps: videoConfig.fps,
    frame: frame,
    durationInFrames: textEntranceDurationInFrames,
    config: {
      damping: 200,
    },
  });

  const textEntranceY = spring({
    fps: videoConfig.fps,
    frame: frame,
    from: 40,
    to: 0,
    durationInFrames: textEntranceDurationInFrames,
    config: {
      damping: 200,
    },
  });

  // Step B: Background wipe (frames 10-30)
  const wipeProgress = spring({
    fps: videoConfig.fps,
    frame: frame - textEntranceDurationInFrames,
    durationInFrames: 20,
    config: {
      damping: 200,
    },
  });

  const highlightTextColor = getContrastColor(bgColor);

  const fontSize = fitTextOnNLines({
    text,
    maxBoxWidth: videoConfig.width * 0.9 - paddingInline * 2,
    maxLines: 1,
    fontFamily: FONT_FAMILY,
    fontWeight,
    maxFontSize,
    validateFontIsLoaded: true,
  }).fontSize;

  return (
    <div
      style={{
        ...containerStyle,
        fontSize,
        opacity: textEntranceOpacity,
        transform: `translateY(${textEntranceY}px)`,
      }}
    >
      {/* base text layer - visible during text entrance */}
      <div
        style={{
          ...baseLayerStyle,
        }}
      >
        {text}
      </div>

      {/* overlay background layer - visible during and after wipe */}
      <div
        style={{
          ...overlayLayerStyle,
          backgroundColor: bgColor,
          clipPath: `inset(0 ${100 - wipeProgress * 100}% 0 0)`,
          color: highlightTextColor,
        }}
      >
        {text}
      </div>
    </div>
  );
};
