import * as effectEslint from "@effect/eslint-plugin";
import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import codegen from "eslint-plugin-codegen";
import _import from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import functional from "eslint-plugin-functional";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/dist", "**/build", "**/docs", "**/*.md"],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ),
  ...effectEslint.configs.dprint,
  functional.configs.externalTypeScriptRecommended,
  functional.configs.recommended,
  functional.configs.stylistic,
  {
    plugins: {
      import: fixupPluginRules(_import),
      "sort-destructure-keys": sortDestructureKeys,
      "simple-import-sort": simpleImportSort,
      codegen,
      typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: "module",
      parserOptions: {
        projectService: true,
      },
    },

    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },

      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },

    rules: {
      "codegen/codegen": "error",
      "no-fallthrough": "error",
      "no-irregular-whitespace": "off",
      "object-shorthand": "error",
      "prefer-destructuring": "off",
      "sort-imports": "off",

      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.property.name='push'] > SpreadElement.arguments",
          message: "Do not use spread arguments in Array.push",
        },
      ],

      "no-unused-vars": "off",
      "prefer-rest-params": "off",
      "prefer-spread": "off",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-unresolved": "off",
      "import/order": "off",
      "simple-import-sort/imports": "off",
      "sort-destructure-keys/sort-destructure-keys": "error",

      "@typescript-eslint/array-type": [
        "warn",
        {
          default: "generic",
          readonly: "generic",
        },
      ],

      "@typescript-eslint/member-delimiter-style": 0,
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/consistent-type-imports": "warn",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/camelcase": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/no-array-constructor": "error",
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/no-namespace": "error",

      "@effect/dprint": [
        "off", // conflicts heavily with prettier and looks way worse
        {
          config: {
            indentWidth: 2,
            lineWidth: 120,
            semiColons: "always",
            quoteStyle: "alwaysDouble",
            trailingCommas: "never",
            operatorPosition: "maintain",
            "arrowFunction.useParentheses": "force",
          },
        },
      ],

      // Make `functional` play nicely with Effect
      "functional/no-classes": "off",
      "functional/no-class-inheritance": "off",
    },
  },
  eslintConfigPrettier,
];
