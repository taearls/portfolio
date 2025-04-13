import { defineConfig } from "cypress";

const BASE_CYPRESS_DIR = "tests/integration";

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
});