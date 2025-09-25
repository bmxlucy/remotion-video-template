import fs from "fs";
import path from "path";
import * as glob from "glob";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import type { WebpackOverrideFn } from "@remotion/bundler";
import { videoTemplateSchema } from "../src/VideoTemplate";

// CLI argument parsing
const getDataPattern = (): string => {
  const dataArg = process.argv.find((arg) => arg.startsWith("--data="));
  if (!dataArg) {
    throw new Error(
      "Missing --data argument. Usage: npm run render -- --data='./dataset/*.json'",
    );
  }
  return dataArg.split("=")[1];
};

// Check for webpack override in remotion.config.ts or separate file
const getWebpackOverride = async (): Promise<WebpackOverrideFn | undefined> => {
  try {
    // Check for separate webpack override file
    const overridePath = path.resolve("./src/webpack-override.ts");
    if (fs.existsSync(overridePath)) {
      console.log("📦 Found webpack override file");
      const { webpackOverride } = await import(overridePath);
      return webpackOverride;
    }
    return undefined;
  } catch (error) {
    console.warn(
      "⚠️ Could not load webpack override:",
      error instanceof Error ? error.message : error,
    );
    return undefined;
  }
};

// Use original JSON filename for video output
const getOutputFilename = (jsonFilePath: string): string => {
  return path.basename(jsonFilePath, ".json");
};

// Main batch render function
const renderBatch = async (): Promise<void> => {
  try {
    console.log("🎬 Starting batch render...");

    // Parse CLI arguments
    const dataPattern = getDataPattern();
    console.log(`📂 Finding files matching: ${dataPattern}`);

    // Find all JSON files using glob
    const jsonFiles = glob.sync(dataPattern).sort();
    if (jsonFiles.length === 0) {
      throw new Error(`No files found matching pattern: ${dataPattern}`);
    }
    console.log(
      `✅ Found ${jsonFiles.length} files:`,
      jsonFiles.map((f) => path.basename(f)),
    );

    // Get webpack override if available
    const webpackOverride = await getWebpackOverride();

    // Bundle Remotion project once
    console.log("📦 Bundling Remotion project...");
    const bundleLocation = await bundle({
      entryPoint: path.resolve("./src/index.ts"),
      webpackOverride,
    });

    // Create output directory if it doesn't exist
    const outputDir = "out";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Render each video
    for (let i = 0; i < jsonFiles.length; i++) {
      const filePath = jsonFiles[i];
      const fileName = path.basename(filePath, ".json");

      console.log(
        `\n🎥 [${i + 1}/${jsonFiles.length}] Processing: ${fileName}`,
      );

      try {
        // Read and validate JSON data
        const rawData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const data = videoTemplateSchema.parse(rawData);

        // Use original JSON filename for output
        const outputFilename = getOutputFilename(filePath);
        const outputPath = `out/${outputFilename}.mp4`;

        console.log(`📝 Title: "${data.title}"`);
        console.log(`📐 Ratio: ${data.ratio}`);
        console.log(`💾 Output: ${outputPath}`);

        // Get composition with input props
        const composition = await selectComposition({
          serveUrl: bundleLocation,
          id: "VideoTemplate",
          inputProps: data,
        });

        // Render the video
        await renderMedia({
          composition,
          serveUrl: bundleLocation,
          codec: "h264",
          outputLocation: outputPath,
          inputProps: data,
        });

        console.log(`✅ Rendered: ${outputFilename}.mp4`);
      } catch (error) {
        console.error(
          `❌ Failed to process ${fileName}:`,
          error instanceof Error ? error.message : error,
        );
        // Continue with next file instead of stopping entire batch
      }
    }

    console.log(`\n🎉 Batch render complete! Check the 'out/' directory.`);
  } catch (error) {
    console.error(
      "💥 Batch render failed:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
};

// Run the batch render
renderBatch();
