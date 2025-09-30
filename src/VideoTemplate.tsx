import { zColor } from "@remotion/zod-types";
import React, { useMemo, useRef } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { z } from "zod";
import { Highlight } from "./VideoTemplate/Highlight";
import { Subtitle } from "./VideoTemplate/Subtitle";
import { Title } from "./VideoTemplate/Title";
import { BACKGROUND_COLOR } from "./VideoTemplate/constants";
import { useFitText } from "./utils/fitText";

const containerStyle: React.CSSProperties = {
  backgroundColor: BACKGROUND_COLOR,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

export const videoTemplateSchema = z.object({
  title: z.string(),
  subTitle: z.string(),
  highlights: z.array(
    z.object({
      text: z.string(),
      bgColor: zColor(),
    }),
  ),
  ratio: z.enum(["9:16", "1:1", "16:9"]),
});

export const VideoTemplate: React.FC<z.infer<typeof videoTemplateSchema>> = ({
  title,
  subTitle,
  highlights,
}) => {
  const videoConfig = useVideoConfig();
  const containerWidth = videoConfig.width * 0.95;
  const containerHeight = videoConfig.height * 0.95;
  const contentRef = useRef<HTMLDivElement>(null);

  const HIGHLIGHTS_START_DELAY = 50;
  const durationPerHighlight = Math.floor(
    (videoConfig.durationInFrames - HIGHLIGHTS_START_DELAY) / highlights.length,
  );

  const longestHighlight = useMemo(
    () =>
      highlights.reduce((longest, current) =>
        current.text.length > longest.text.length ? current : longest,
      ),
    [highlights],
  );

  const fontScale = useFitText(contentRef, containerWidth, containerHeight);

  return (
    <AbsoluteFill style={containerStyle}>
      <div
        ref={contentRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: containerWidth,
          maxWidth: containerWidth,
          maxHeight: containerHeight,
          fontSize: `${fontScale}em`,
        }}
      >
        <Title titleText={title} />

        <Subtitle subTitleText={subTitle} delay={20} />

        <div
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          {highlights.map((highlight, index) => {
            const isLongest = highlight === longestHighlight;
            return (
              <Highlight
                key={index}
                text={highlight.text}
                bgColor={highlight.bgColor}
                delay={HIGHLIGHTS_START_DELAY + index * durationPerHighlight}
                duration={
                  index === highlights.length - 1
                    ? Infinity
                    : durationPerHighlight
                }
                static={isLongest}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
