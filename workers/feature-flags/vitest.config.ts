import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.toml" },
      // Tests inject a mocked KV binding and run against local Miniflare
      // storage, so skip the authenticated remote proxy that the
      // `remote = true` KV namespace in wrangler.toml would otherwise require.
      remoteBindings: false,
    }),
  ],
  test: {},
});
