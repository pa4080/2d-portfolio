import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";

export default defineConfig([
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["**/*.js"],
    plugins: {
      js,
      prettier, // Register the plugin
    },
    extends: [
      "js/recommended",
    ],
    rules: {
      semi: ["error", "always"], // Your custom ESLint rule
    },
  },
]);
