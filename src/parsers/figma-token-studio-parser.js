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

// Load original design tokens JSON file
fs.readFile(inputFilePath, "utf8", (err, data) => {
  if (err) throw err;
  const designTokensJson = JSON.parse(data);
  const modifiedJson = transformDesignTokens(designTokensJson, true);

  // Ensure the output directory exists
  fs.mkdir(outputDir, { recursive: true }, (err) => {
    if (err) throw err;

    // Write the modified JSON to a new file
    fs.writeFile(
      outputFilePath,
      JSON.stringify(modifiedJson, null, 2),
      (err) => {
        if (err) throw err;
        console.log("Figma Token Studio transformer");
        console.log(chalk.bold.green(`✔︎ ${relativeOutputFilePath}\n`));
      }
    );
  });
});
