/// <reference types="vitest" />
/// <reference types="vite/client" />

import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export type ViteConfigInput = {
  mode: "development" | "production";
};

// https://vitejs.dev/config/
export default (args: ViteConfigInput) => {
  const generateScopedName =
    args.mode === "development" ? "[local]_[hash:base64:4]" : "[hash:base64:4]";
  return defineConfig({
    assetsInclude: ["**.*.svg"],
    base: "./",
    build: {
      cssMinify: "esbuild",
      emptyOutDir: true,
      outDir: "./dist",
      target: "es2022",
    },
    css: {
      modules: {
        generateScopedName,
        localsConvention: "camelCase",
      },
    },
    json: {
      stringify: true,
    },
    logLevel: args.mode === "development" ? "warn" : "silent",
    plugins: [
      tailwindcss(),
      react({
        babel: {
          plugins: [
            [
              "babel-plugin-react-compiler",
              {
                compilationMode: "infer",
              },
            ],
          ],
        },
        jsxImportSource:
          args.mode === "development"
            ? "@welldone-software/why-did-you-render"
            : "react",
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: 3000,
    },
  });
};
