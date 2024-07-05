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

// Load original design tokens JSON file
fs.readFile(inputFilePath, "utf8", (err, data) => {
  if (err) throw err;
  let designTokensJson = JSON.parse(data);
  designTokensJson = transformDesignTokens(designTokensJson, true);

  // Replace token types with Figma Token Studio specific types
  designTokensJson = replaceTokenTypes(designTokensJson);

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
