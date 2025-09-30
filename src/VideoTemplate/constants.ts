import { loadFont } from "@remotion/google-fonts/Geist";

export const { fontFamily: FONT_FAMILY } = loadFont("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const BACKGROUND_COLOR = "#000";
export const TITLE_COLOR = "#fff";
export const SUBTITLE_COLOR = "#ffffff80";
export const HIGHLIGHT_COLOR = "#fff";
