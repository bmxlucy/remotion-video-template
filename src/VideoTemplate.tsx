import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { Highlights } from "./VideoTemplate/Highlights";
import { Title } from "./VideoTemplate/Title";
import { Subtitle } from "./VideoTemplate/Subtitle";
import { BACKGROUND_COLOR } from "./VideoTemplate/constants";

const containerStyle: React.CSSProperties = {
  backgroundColor: BACKGROUND_COLOR,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  textWrap: "balance",
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
  return (
    <AbsoluteFill style={containerStyle}>
      <Title titleText={title} />

      <Subtitle subTitleText={subTitle} delay={20} />

      <Highlights highlights={highlights} delay={50} />
    </AbsoluteFill>
  );
};
