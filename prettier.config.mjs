export default {
  $schema: "https://json.schemastore.org/prettierrc",
  importOrder: [
    "<TYPES>^(node:)",
    "<TYPES>",
    "<TYPES>^[.]",
    "",
    "<BUILTIN_MODULES>",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^(@)(/.*)$",
    "^[.]",
  ],
  plugins: [
    // https://github.com/IanVS/prettier-plugin-sort-imports
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  tailwindConfig: "./tailwind.config.ts",
  trailingComma: "all",
};
