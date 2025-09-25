// Helper function to calculate luminance for contrast determination
export const getLuminance = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

// Helper function to get high contrast color
export const getContrastColor = (bgColor: string): string => {
  const luminance = getLuminance(bgColor);
  return luminance > 0.5 ? "#000000" : "#ffffff";
};
