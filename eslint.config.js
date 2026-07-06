import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import eslintReact from "@eslint-react/eslint-plugin";
import eslint from "@eslint/js";
import query from "@tanstack/eslint-plugin-query";
import gitignore from "eslint-config-flat-gitignore";
import reactHooks from "eslint-plugin-react-hooks";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const GLOBS_JS = ["**/*.{js,mjs,cjs}", "*.{js,mjs,cjs}"];
const GLOBS_TS = ["**/*.{ts,mts,cts,tsx,mtsx,ctsx}"];
const GLOBS_JSX = ["**/*.{jsx,tsx,mjsx,cjsx,mtsx,ctsx}"];
const GLOBS_JS_ALL = [...GLOBS_JS, ...GLOBS_TS, ...GLOBS_JSX];

export default defineConfig(
  {
    ...gitignore(),
    name: "lungenfachaerzte/gitignore",
  },
  {
    name: "lungenfachaerzte/additionalIgnores",
    ignores: ["pnpm-lock.yaml", "src/routeTree.gen.ts"],
  },
  {
    ...eslint.configs.recommended,
    name: "eslint/configs/recommended",
  },
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeCheckedOnly.map((config) => ({
    ...config,
    files: GLOBS_TS,
  })),
  {
    name: "typescript-eslint/parserOptions",
    files: GLOBS_TS,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    name: "lungenfachaerzte/javascript/globals",
    files: GLOBS_JS_ALL,
    languageOptions: {
      globals: {
        ...globals.es2023,
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  {
    name: "plugin/imports",
    files: GLOBS_JS_ALL,
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: GLOBS_JS_ALL,
    ...unicorn.configs.recommended,
    name: "plugin/unicorn",
  },
  {
    files: GLOBS_JS_ALL,
    ...comments.recommended,
    name: "plugin/comments",
  },
  {
    files: GLOBS_JSX,
    ...reactHooks.configs.flat["recommended-latest"],
    name: "plugin/react-hooks/recommended",
  },
  {
    files: GLOBS_JSX,
    ...eslintReact.configs.recommended,
    name: "plugin/eslint-react/recommended",
  },
  query.configs["flat/recommended"].map((config) => ({
    ...config,
    files: GLOBS_JSX,
    name: "plugin/query",
  })),
  {
    name: "lungenfachaerzte/javascript/overrides",
    files: GLOBS_JS_ALL,
    rules: {
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-negated-condition": "off",
      "unicorn/filename-case": [
        "warn",
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
        },
      ],
      "unicorn/prefer-module": "off",
      "unicorn/no-null": "off",
      "unicorn/no-nested-ternary": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "unicorn/prefer-top-level-await": "off",
      "unicorn/prefer-global-this": "off",
      "unicorn/no-array-reduce": "off",
      "@eslint-community/eslint-comments/disable-enable-pair": [
        "error",
        { allowWholeFile: true },
      ],
      "@eslint-community/eslint-comments/no-unused-disable": "error",
    },
  },
  {
    name: "lungenfachaerzte/typescript/overrides",
    files: GLOBS_TS,
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/only-throw-error": "off",
    },
  },
  {
    // HTML from Craft CMS is sanitized server-side via sanitize-html in TextSchema.
    name: "lungenfachaerzte/allow-dangerously-set-innerhtml",
    files: GLOBS_JSX,
    rules: {
      "@eslint-react/dom-no-dangerously-set-innerhtml": "off",
    },
  },
);
