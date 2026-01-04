export const FEATURE_FLAGS_URL =
  import.meta.env?.VITE_FEATURE_FLAGS_API_URL ?? "";
export const CACHE_KEY = "portfolio:feature-flags";
export const CACHE_TTL = 60_000; // 1 minute (matches Worker cache)
export const REFETCH_INTERVAL = 60_000; // 1 minute
export const REQUEST_TIMEOUT = 5_000; // 5 seconds
