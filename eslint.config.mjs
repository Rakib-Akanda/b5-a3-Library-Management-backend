// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier/flat"; // ⚠️ v10-এর default হল object নয়, array

import prettierPlugin from "eslint-plugin-prettier";

export default [
  { ignores: ["dist/**", "node_modules/**"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  /* ---- Prettier Flat Config ---- */
  prettierConfig,

  /* ---- Project-specific rules ---- */
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: "./tsconfig.json" },
    },
    plugins: { prettier: prettierPlugin },
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": ["warn"],
      "prettier/prettier": "error",
      "no-trailing-spaces": [
        "error",
        {
          skipBlankLines: false,
          ignoreComments: true,
        },
      ],
      "no-multi-spaces": ["error"],
      "no-multiple-empty-lines": [
        "error",
        {
          max: 2,
          maxEOF: 0,
          maxBOF: 0,
        },
      ],
    },
  },
];
