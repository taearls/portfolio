import type { FeatureFlagContextValue } from "@/types/featureFlags.ts";

import { useContext } from "react";

import { FeatureFlagContext } from "@/state/contexts/FeatureFlagContext.tsx";

/**
 * Hook to access feature flags context
 */
export function useFeatureFlags(): FeatureFlagContextValue {
  const context = useContext(FeatureFlagContext);

  if (context === undefined) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagProvider",
    );
  }

  return context;
}
