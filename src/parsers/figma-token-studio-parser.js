import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import transformDesignTokens from "./transform-design-tokens.js";
import chalk from "chalk";

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = path.join(__dirname, "../../tokens-raw/tokens.json");
const outputDir = path.join(
  __dirname,
  "../../tokens-parsed/figma-token-studio"
);
const outputFilePath = path.join(outputDir, "tokens.json");

// Compute the relative path from the current working directory
const relativeOutputFilePath = path.relative(process.cwd(), outputFilePath);

// Function to replace token types based on specific paths
function replaceTokenTypes(tokens) {
  const pathMapping = {
    "core.font.family": "fontFamilies",
    "core.font.weight": "fontWeights",
    "core.font.lineheight": "lineHeights",
    "core.font.body": "fontSizes",
    "core.font.heading": "fontSizes",
    "core.border.width": "borderWidth",
    "core.border.radius": "borderRadius",
  };

  function traverseAndReplace(obj, currentPath = "") {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          traverseAndReplace(obj[key], newPath);
        } else if (key === "type") {
          const pathKey = currentPath.split(".").slice(0, 3).join(".");
          if (pathMapping[pathKey]) {
            obj[key] = pathMapping[pathKey];
          }
        }
      }
    }
  }
  traverseAndReplace(tokens);
  return tokens;
}

// Token Studio $themes and $metadata
const tokenStudioThemesAndMetadata = {
  $themes: [
    {
      id: "b2e2be6ff5c7761939b69817eabbbe2f88f5ab91",
      name: "core",
      selectedTokenSets: {
        core: "enabled",
      },
      $figmaStyleReferences: {},
      $figmaVariableReferences: {},
      $figmaCollectionId: "VariableCollectionId:10:349",
      $figmaModeId: "10:9",
    },
    {
      id: "6a148de1a5f4c2ef8bfd53876881c3cb5e3b2baa",
      name: "light",
      selectedTokenSets: {
        core: "source",
        light: "enabled",
      },
      $figmaStyleReferences: {},
      $figmaVariableReferences: {},
      $figmaCollectionId: "VariableCollectionId:10:456",
      $figmaModeId: "10:10",
    },
    {
      id: "523c952e5224ccc914212943c7ae93e11298ef35",
      name: "dark",
      selectedTokenSets: {
        core: "source",
        dark: "enabled",
      },
      $figmaStyleReferences: {},
      $figmaVariableReferences: {},
      $figmaCollectionId: "VariableCollectionId:10:467",
      $figmaModeId: "10:11",
    },
  ],
  $metadata: {
    tokenSetOrder: ["core", "light", "dark"],
  },
};

// Load original design tokens JSON file
fs.readFile(inputFilePath, "utf8", (err, data) => {
  if (err) throw err;
  let designTokensJson = JSON.parse(data);
  designTokensJson = transformDesignTokens(designTokensJson, true);

  // Replace token types with Figma Token Studio specific types
  designTokensJson = replaceTokenTypes(designTokensJson);

  // Add composite tokens for Typography
  //designTokensJson = addTypographyTokens(designTokensJson);

  // Merge the $themes and $metadata into the design tokens JSON
  designTokensJson = { ...designTokensJson, ...tokenStudioThemesAndMetadata };

  // Ensure the output directory exists
  fs.mkdir(outputDir, { recursive: true }, (err) => {
    if (err) throw err;

    // Write the modified JSON to a new file
    fs.writeFile(
      outputFilePath,
      JSON.stringify(designTokensJson, null, 2),
      (err) => {
        if (err) throw err;
        console.log("Figma Token Studio transformer");
        console.log(chalk.bold.green(`✔︎ ${relativeOutputFilePath}\n`));
      }
    );
  });
});
