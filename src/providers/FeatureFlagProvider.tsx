import type {
  FeatureFlagContextValue,
  FeatureFlags,
} from "@/types/featureFlags.ts";
import type { ReactNode } from "react";

import { useEffect, useState } from "react";

import { REFETCH_INTERVAL } from "@/constants/featureFlags.ts";
import { FeatureFlagContext } from "@/state/contexts/FeatureFlagContext.tsx";
import { DEFAULT_FLAGS } from "@/types/featureFlags.ts";
import {
  fetchFlags,
  getCachedFlags,
  setCachedFlags,
} from "@/util/feature-flags/feature-flags.util.ts";

interface FeatureFlagProviderProps {
  children: ReactNode;
}

const FeatureFlagProvider = ({ children }: FeatureFlagProviderProps) => {
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    // Try to load from cache first for instant display
    const cached = getCachedFlags();
    return cached ?? DEFAULT_FLAGS;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadFlags = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fetchedFlags = await fetchFlags();

      setFlags(fetchedFlags);
      setCachedFlags(fetchedFlags);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to load feature flags");
      console.error("Feature flags error:", error);
      setError(error);

      // On error, keep existing flags (cached or default)
      // Don't reset to DEFAULT_FLAGS to preserve last known good state
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadFlags();
  }, []);

  // Periodic refetch
  useEffect(() => {
    const interval = setInterval(() => {
      loadFlags();
    }, REFETCH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const value: FeatureFlagContextValue = {
    error,
    flags,
    isLoading,
    refetch: loadFlags,
  };

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export default FeatureFlagProvider;
