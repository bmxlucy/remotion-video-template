// Calculate dimensions based on aspect ratio
export const getDimensions = (ratio: "9:16" | "1:1" | "16:9") => {
  const baseSize = 1080;
  switch (ratio) {
    case "9:16":
      return { width: baseSize, height: Math.round((baseSize * 16) / 9) };
    case "1:1":
      return { width: baseSize, height: baseSize };
    case "16:9":
    default:
      return { width: Math.round((baseSize * 16) / 9), height: baseSize };
  }
};
