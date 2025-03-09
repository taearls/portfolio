import { configDefaults, defineConfig, mergeConfig } from "vitest/config";

import type { ViteConfigInput } from "./vite.config.mts";
import viteConfig from "./vite.config.mts";

export default (args: ViteConfigInput) =>
  mergeConfig(
    viteConfig(args),
    defineConfig({
      test: {
        environment: "jsdom",
        exclude: [...configDefaults.exclude, "tests/integration/**"],
        globals: true,
        // NOTE: this option could be useful for unit test performance tuning
        // logHeapUsage: true,
      },
    }),
  );
