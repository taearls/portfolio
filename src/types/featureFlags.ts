/**
 * Feature Flags Type Definitions
 *
 * Shared types between the React application and Cloudflare Worker
 */

export interface ContactFormFlags {
  enabled: boolean;
  message?: string;
}

export interface FeatureFlags {
  contactForm: ContactFormFlags;
}

export const DEFAULT_FLAGS: FeatureFlags = {
  contactForm: {
    enabled: false, // Safe default - disabled until explicitly enabled via Worker
  },
};

export interface FeatureFlagContextValue {
  flags: FeatureFlags;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface CachedFlags {
  flags: FeatureFlags;
  timestamp: number;
}
