import React from "react";
import { Series, useVideoConfig } from "remotion";
import { HighlightItem } from "./HighlightItem";

const containerStyle: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: 80,
};

export const Highlights: React.FC<{
  readonly highlights: { text: string; bgColor: string }[];
  readonly delay?: number;
}> = ({ highlights, delay = 0 }) => {
  const videoConfig = useVideoConfig();
  const totalFrames = videoConfig.durationInFrames - delay;
  const baseDuration = Math.floor(totalFrames / highlights.length);
  const remainingFrames = totalFrames % highlights.length;

  return (
    <div style={containerStyle}>
      <Series>
        {highlights.map((highlight, index) => (
          <Series.Sequence
            key={index}
            durationInFrames={
              baseDuration +
              (index === highlights.length - 1 ? remainingFrames : 0)
            }
            offset={index === 0 ? delay : 0}
            name={highlight.text}
          >
            <HighlightItem text={highlight.text} bgColor={highlight.bgColor} />
          </Series.Sequence>
        ))}
      </Series>
    </div>
  );
};
