import type { CachedFlags, FeatureFlags } from "@/types/featureFlags.ts";

import {
  CACHE_KEY,
  CACHE_TTL,
  FEATURE_FLAGS_URL,
  REQUEST_TIMEOUT,
} from "@/constants/featureFlags.ts";

/**
 * Get flags from localStorage cache
 */
export function getCachedFlags(): FeatureFlags | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { flags, timestamp }: CachedFlags = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age > CACHE_TTL) {
      // Cache expired
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return flags;
  } catch (error) {
    console.error("Error reading cached feature flags:", error);
    return null;
  }
}

/**
 * Save flags to localStorage cache
 */
export function setCachedFlags(flags: FeatureFlags): void {
  try {
    const cached: CachedFlags = {
      flags,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.error("Error caching feature flags:", error);
  }
}

/**
 * Fetch flags from Worker with timeout
 */
export async function fetchFlags(): Promise<FeatureFlags> {
  if (!FEATURE_FLAGS_URL) {
    throw new Error(
      "VITE_FEATURE_FLAGS_API_URL environment variable not configured",
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(FEATURE_FLAGS_URL, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch feature flags: ${response.status} ${response.statusText}`,
      );
    }

    const flags = (await response.json()) as FeatureFlags;
    return flags;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Feature flags request timed out");
      }
      throw error;
    }

    throw new Error("Unknown error fetching feature flags");
  }
}
