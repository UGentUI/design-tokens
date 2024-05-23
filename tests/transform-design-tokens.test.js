import { describe, it, expect } from "vitest";
import transformDesignTokens from "../src/parsers/transform-design-tokens.js";

describe("transformDesignTokens", () => {
  it("should remove $ from keys", () => {
    const input = {
      $example: {
        $type: "color",
        $value: "#FFFFFF",
      },
    };
    const expectedOutput = {
      example: {
        type: "color",
        value: "#FFFFFF",
      },
    };
    const output = transformDesignTokens(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should transform nested objects", () => {
    const input = {
      $level1: {
        $level2: {
          $type: "color",
          $value: "#FFFFFF",
        },
      },
    };
    const expectedOutput = {
      level1: {
        level2: {
          type: "color",
          value: "#FFFFFF",
        },
      },
    };
    const output = transformDesignTokens(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should modify references if modifyReferences is true", () => {
    const input = {
      $example: {
        $type: "color",
        $value: "{core.color.primary}",
      },
    };
    const expectedOutput = {
      example: {
        type: "color",
        value: "{color.primary}",
      },
    };
    const output = transformDesignTokens(input, true);
    expect(output).toEqual(expectedOutput);
  });

  it("should not modify references if modifyReferences is false", () => {
    const input = {
      $example: {
        $type: "color",
        $value: "{core.color.primary}",
      },
    };
    const expectedOutput = {
      example: {
        type: "color",
        value: "{core.color.primary}",
      },
    };
    const output = transformDesignTokens(input);
    expect(output).toEqual(expectedOutput);
  });

  it("should handle mixed nested objects and references", () => {
    const input = {
      $level1: {
        $level2: {
          $type: "color",
          $value: "{core.neutral.secondary}",
        },
      },
    };
    const expectedOutput = {
      level1: {
        level2: {
          type: "color",
          value: "{neutral.secondary}",
        },
      },
    };
    const output = transformDesignTokens(input, true);
    expect(output).toEqual(expectedOutput);
  });
});
