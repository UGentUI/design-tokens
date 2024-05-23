import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, it, expect } from "vitest";

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load tokens from JSON file
const tokensFilePath = path.join(__dirname, "../tokens-raw/tokens.json");
const tokens = JSON.parse(fs.readFileSync(tokensFilePath, "utf8"));

describe("Design Tokens", () => {
  it("should have type & value properties", () => {
    const checkProperties = (token) => {
      expect(token).toHaveProperty("$type");
      expect(token).toHaveProperty("$value");
    };

    const traverseTokens = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "object") {
          if (obj[key].hasOwnProperty("$type")) {
            checkProperties(obj[key]);
          } else {
            traverseTokens(obj[key]);
          }
        }
      }
    };

    traverseTokens(tokens);
  });

  it("should have a dark equivalent for every light token", () => {
    const getTokens = (theme) => {
      const themeTokens = {};
      const traverseTokens = (obj, prefix = "") => {
        for (const key in obj) {
          if (typeof obj[key] === "object") {
            if (obj[key].hasOwnProperty("$type")) {
              themeTokens[`${prefix}${key}`] = obj[key];
            } else {
              traverseTokens(obj[key], `${prefix}${key}.`);
            }
          }
        }
      };
      traverseTokens(tokens[theme]);
      return themeTokens;
    };

    const lightTokens = getTokens("light");
    const darkTokens = getTokens("dark");

    let missingTokens = [];

    for (const key in lightTokens) {
      if (!darkTokens.hasOwnProperty(key)) {
        missingTokens.push(key);
      }
    }

    if (missingTokens.length > 0) {
      console.log(
        "Missing dark equivalents for the following light tokens:",
        missingTokens
      );
    }

    expect(missingTokens.length).toBe(0);
  });

  it("should have correctly formatted values", () => {
    const checkValues = (token) => {
      expect(typeof token.$value).toBe("string");
    };

    const traverseTokens = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "object") {
          if (obj[key].hasOwnProperty("$type")) {
            checkValues(obj[key]);
          } else {
            traverseTokens(obj[key]);
          }
        }
      }
    };

    traverseTokens(tokens);
  });

  it("should not have duplicate tokens", () => {
    const tokenSet = new Set();

    const traverseTokens = (obj, prefix = "") => {
      for (const key in obj) {
        if (typeof obj[key] === "object") {
          if (obj[key].hasOwnProperty("$type")) {
            const tokenPath = `${prefix}${key}`;
            expect(tokenSet.has(tokenPath)).toBe(false);
            tokenSet.add(tokenPath);
          } else {
            traverseTokens(obj[key], `${prefix}${key}.`);
          }
        }
      }
    };

    traverseTokens(tokens);
  });
});
