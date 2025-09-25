import { Composition, CalculateMetadataFunction } from "remotion";
import { VideoTemplate, videoTemplateSchema } from "./VideoTemplate";
import { getDimensions } from "./utils/dimensions";

import { z } from "zod";

const calculateMetadata: CalculateMetadataFunction<
  z.infer<typeof videoTemplateSchema>
> = ({ props }) => {
  const dimensions = getDimensions(props.ratio);

  return {
    width: dimensions.width,
    height: dimensions.height,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoTemplate"
        component={VideoTemplate}
        durationInFrames={300}
        fps={30}
        schema={videoTemplateSchema}
        defaultProps={{
          title: "5 Tips to Hook Viewers",
          subTitle: "Grow faster with smart editing",
          highlights: [
            { text: "Open with a bold claim", bgColor: "#7c3aed" },
            { text: "Use visual storytelling", bgColor: "#fde047" },
            { text: "Add dynamic transitions", bgColor: "#dc2626" },
            { text: "Include clear call-to-action", bgColor: "#ff5900" },
          ],
          ratio: "16:9" as const,
        }}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
