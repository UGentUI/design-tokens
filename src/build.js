import StyleDictionary from "style-dictionary";

const styleDictionary = StyleDictionary.extend({
  source: ["./tokens-parsed/style-dictionary/tokens.json"],
  platforms: {
    css: {
      transformGroup: "web",
      buildPath: "build/",
      files: [
        {
          destination: "css/variables.css",
          format: "css/variables",
          options: {
            selector: ":root",
          },
          filter: (token) => {
            return !token.name.startsWith("core-color");
          },
        },
        // Light theme CSS
        {
          destination: "css/light-theme.css",
          format: "css/theme-variables",
          options: {
            selector: ':root,:root[data-color-mode="light"]', // Default theme
          },
          filter: (token) => {
            return (
              token.attributes.category === "light" ||
              (token.attributes.type === "neutral" &&
                token.attributes.item != "dark")
            );
          },
        },
        // Dark theme CSS
        {
          destination: "css/dark-theme.css",
          format: "css/theme-variables",
          options: {
            selector: ':root[data-color-mode="dark"]',
          },
          filter: (token) => {
            return (
              token.attributes.category === "dark" ||
              (token.attributes.type === "neutral" &&
                token.attributes.item === "dark")
            );
          },
        },
        // Core CSS
        {
          destination: "css/core.css",
          format: "css/core-variables",
          options: {
            selector: ":root",
          },
          filter: (token) => {
            return (
              token.attributes.category === "core" &&
              !token.name.startsWith("core-color")
            );
          },
        },
      ],
    },
    scss: {
      transformGroup: "scss",
      buildPath: "build/",
      files: [
        {
          destination: "scss/_variables.scss",
          format: "scss/variables",
          filter: (token) => {
            return !token.name.startsWith("core-color");
          },
        },
        {
          destination: "scss/_light-theme-map.scss",
          format: "scss/map-flat-theme",
          mapName: "light",
          filter: (token) => {
            return (
              token.attributes.category === "light" ||
              (token.attributes.type === "neutral" &&
                token.attributes.item != "dark")
            );
          },
        },
        {
          destination: "scss/_dark-theme-map.scss",
          format: "scss/map-flat-theme",
          mapName: "dark",
          filter: (token) => {
            return (
              token.attributes.category === "dark" ||
              (token.attributes.type === "neutral" &&
                token.attributes.item === "dark")
            );
          },
        },
        {
          destination: "scss/_core-map.scss",
          format: "scss/map-flat-core",
          mapName: "core",
          filter: (token) => {
            return (
              token.attributes.category === "core" &&
              !token.name.startsWith("core-color")
            );
          },
        },
      ],
    },
  },
});

styleDictionary.registerFormat({
  name: "css/theme-variables",
  formatter: function ({ dictionary, platform, options, file }) {
    // Use options to get selector, with a fallback to ':root' if not provided
    const selector = options && options.selector ? options.selector : ":root";

    let output = `${selector} {\n`;
    dictionary.allProperties.map((prop) => {
      const baseName = prop.name.replace(/core-|dark-|light-/g, ""); // Simplify token name
      output += `  --${baseName}: var(--${prop.name}, ${prop.value});\n`;
    });
    output += "}\n";
    return output;
  },
});

styleDictionary.registerFormat({
  name: "css/core-variables",
  formatter: function ({ dictionary, platform, options, file }) {
    // Use options to get selector, with a fallback to ':root' if not provided
    const selector = options && options.selector ? options.selector : ":root";

    let output = `${selector} {\n`;
    dictionary.allProperties.map((prop) => {
      const baseName = prop.name.replace(/core-/g, ""); // Simplify token name
      output += `  --${baseName}: ${prop.value};\n`;
    });
    output += "}\n";
    return output;
  },
});

styleDictionary.registerFormat({
  name: "scss/map-flat-theme",
  formatter: function ({ dictionary, platform, options, file }) {
    const mapName = file.mapName || "default-theme";

    let output = `$${mapName}: (\n`;
    dictionary.allProperties.map((prop) => {
      const baseName = prop.name.replace(/core-|dark-|light-/g, ""); // Simplify token name
      output += `  "${baseName}": ${prop.value},\n`;
    });
    output += ");";
    return output;
  },
});

styleDictionary.registerFormat({
  name: "scss/map-flat-core",
  formatter: function ({ dictionary, platform, options, file }) {
    const mapName = file.mapName || "default-theme";

    let output = `$${mapName}: (\n`;
    dictionary.allProperties.map((prop) => {
      const baseName = prop.name.replace(/core-/g, ""); // Simplify token name
      let formattedValue = prop.value;
      if (Array.isArray(prop.value)) {
        formattedValue = `(${prop.value.join(", ")})`; // Format array as a list
      } else if (typeof prop.value === "string" && prop.value.includes(",")) {
        // This condition checks for string values that might be lists (like font-families)
        formattedValue = `(${prop.value.split(",").join(", ")})`;
      }

      output += `  "${baseName}": ${formattedValue},\n`;
    });
    output += ");";
    return output;
  },
});

styleDictionary.buildAllPlatforms();
