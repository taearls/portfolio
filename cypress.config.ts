import { defineConfig } from "cypress";

const BASE_CYPRESS_DIR = "tests/integration";

/**
 * API URLs for different environments
 * Can be overridden via CYPRESS_* environment variables
 */
const API_URLS = {
  // Development: Cloudflare Worker dev server on port 8787 (wrangler dev)
  // Note: Port 4173 (baseUrl) is the Vite preview server for the React app
  featureFlagsApi: "http://localhost:8787/api/flags",
  // Production URL (for reference, can override via CYPRESS_featureFlagsApi)
  // "https://portfolio-feature-flags.tyler-a-earls.workers.dev/api/flags"
};

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4173",
    downloadsFolder: `${BASE_CYPRESS_DIR}/downloads`,
    fixturesFolder: `${BASE_CYPRESS_DIR}/fixtures`,
    screenshotsFolder: `${BASE_CYPRESS_DIR}/screenshots`,
    specPattern: `${BASE_CYPRESS_DIR}/**/*.{cy,spec}.{js,jsx,ts,tsx}`,
    supportFile: `${BASE_CYPRESS_DIR}/support/support.ts`,
    videosFolder: `${BASE_CYPRESS_DIR}/videos`,
  },
  env: {
    featureFlagsApi: API_URLS.featureFlagsApi,
  },
});
