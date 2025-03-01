import type { Linter } from "eslint";

import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import eslintJsPlugin from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import { flatConfigs as eslintPluginImportFlatConfigs } from "eslint-plugin-import";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactPerf from "eslint-plugin-react-perf";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config: Array<Linter.Config> = [
  { files: ["**/*.{js,mjs,cjs,ts,mts,jsx,tsx}"] },
  {
    ignores: [
      "dist/*",
      ".react-router/*",
      "node_modules",
      "prettier.config.mjs",
    ],
  },
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
  eslintJsPlugin.configs.recommended,
  ...typescriptEslint.configs.recommended,
  eslintPluginReactPerf.configs.flat.recommended,
  eslintPluginReact.configs.flat!.recommended,
  eslintPluginReactRefresh.configs.recommended,
  eslintConfigPrettier,

  // import plugin settings
  {
    ...eslintPluginImportFlatConfigs.recommended,
    settings: {
      ...eslintPluginImportFlatConfigs.recommended.settings,
      // ignore npm packages starting with @; e.g., @vitejs/plugin-react in vite.config.mts
      "import/ignore": ["@[^/]", "node_modules"],
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
      react: {
        version: "detect",
      },
    },
  },

  // specific rule declarations
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
      // https://vite.dev/guide/performance#reduce-resolve-operations
      "import/extensions": [
        "error",
        "ignorePackages",
        { checkTypeImports: true },
      ],
      "import/no-deprecated": "warn",
      "import/no-extraneous-dependencies": "error",
      "import/no-mutable-exports": "warn",
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "_*", varsIgnorePattern: "_*" },
      ],
      "react/no-array-index-key": "error",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "sort-keys": "warn",
    },
  },

  // eslint-plugin-barrel-files config
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
];

export default config;
