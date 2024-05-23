import path from "path";
import { vol } from "memfs";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import transformDesignTokens from "../src/parsers/transform-design-tokens.js";

const inputFilePath = "/tokens-raw/tokens.json";
const outputDir = "/tokens-parsed/figma-token-studio";
const outputFilePath = path.join(outputDir, "tokens.json");

// Mock data
const mockInputTokens = {
  $example: {
    $type: "color",
    $value: "#FFFFFF",
  },
};

const expectedOutputTokens = {
  example: {
    type: "color",
    value: "#FFFFFF",
  },
};

// Set up the virtual file system
beforeAll(() => {
  vol.fromJSON({
    [inputFilePath]: JSON.stringify(mockInputTokens),
  });
});

afterAll(() => {
  vol.reset();
});

describe("Figma Token Studio Parser", () => {
  it("should read, transform, and write tokens correctly", async () => {
    const script = async () => {
      try {
        // Read input file
        const data = await vol.promises.readFile(inputFilePath, "utf8");
        const designTokensJson = JSON.parse(data);

        // Transform tokens
        const modifiedJson = transformDesignTokens(designTokensJson, true);

        // Ensure the output directory exists
        await vol.promises.mkdir(outputDir, { recursive: true });

        // Write the transformed tokens to the output file
        await vol.promises.writeFile(
          outputFilePath,
          JSON.stringify(modifiedJson, null, 2)
        );
      } catch (error) {
        console.error(error);
      }
    };

    await script();

    // Verify output
    const outputExists = await vol.promises
      .stat(outputFilePath)
      .then(() => true)
      .catch(() => false);
    expect(outputExists).toBe(true);

    const outputContent = await vol.promises.readFile(outputFilePath, "utf8");
    expect(JSON.parse(outputContent)).toEqual(expectedOutputTokens);
  });
});
