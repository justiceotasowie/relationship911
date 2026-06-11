import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },
];
