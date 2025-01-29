import type { Linter } from "eslint";

import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import { flatConfigs as importPluginFlatConfigs } from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config: Array<Linter.Config> = [
  { files: ["**/*.{js,mjs,cjs,ts,mts,jsx,tsx}"] },
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      sourceType: "module",
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react: {
        ...pluginReact.configs.flat!.recommended,
        version: "detect",
      },
    },
  },
  {
    ...importPluginFlatConfigs.recommended,
    settings: {
      ...importPluginFlatConfigs.recommended.settings,

      // ignore npm packages starting with @; e.g., @vitejs/plugin-react in vite.config.mts
      "import/ignore": ["@[^/]"],
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        alias: {
          extensions: [".ts", ".js", ".jsx", ".tsx"],
          map: [["@", fileURLToPath(new URL("./src", import.meta.url))]],
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          moduleDirectory: ["node_modules", "./src/"],
          paths: ["./"],
        },
        typescript: true,
      },
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
    rules: {
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "_*", varsIgnorePattern: "_*" },
      ],
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "_*", varsIgnorePattern: "_*" },
      ],
      "react/react-in-jsx-scope": "off",
      "sort-keys": "warn",
      // not currently supported in eslint-react-plugin with eslint v9
      // "react/no-array-index-key": "error",
    },
  },
  {
    ignores: [
      "dist/*",
      ".react-router/*",
      "node_modules",
      "prettier.config.mjs",
    ],
  },
  eslintConfigPrettier,
  ...compat.config({
    env: {
      es2020: true,
      node: true,
    },
    plugins: ["barrel-files"],
    rules: {
      "barrel-files/avoid-barrel-files": "error",
      "barrel-files/avoid-namespace-import": "error",
      "barrel-files/avoid-re-export-all": "error",
    },
  }),
  reactRefresh.configs.recommended,
];

export default config;
