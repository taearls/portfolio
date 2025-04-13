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
    base: "./",
    build: {
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
    plugins: [react()],
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
