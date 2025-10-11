/// <reference types="vitest" />
/// <reference types="vite/client" />

import { fileURLToPath } from "node:url";

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
      react({
        jsxImportSource: "@welldone-software/why-did-you-render",
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
