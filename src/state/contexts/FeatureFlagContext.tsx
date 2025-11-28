import type { FeatureFlagContextValue } from "@/types/featureFlags.ts";

import { createContext } from "react";

/**
 * Feature Flag Context
 *
 * Provides runtime-configurable feature flags fetched from Cloudflare Worker
 * with multi-layer caching and safe defaults
 */

export const FeatureFlagContext = createContext<
  FeatureFlagContextValue | undefined
>(undefined);
