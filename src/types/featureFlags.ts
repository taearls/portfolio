/**
 * Feature Flags Type Definitions
 *
 * Shared types between the React application and Cloudflare Worker
 */

export interface EmailContactFormFlags {
  enabled: boolean;
  message?: string;
}

export interface FeatureFlags {
  "email-contact-form": EmailContactFormFlags;
}

export const DEFAULT_FLAGS: FeatureFlags = {
  "email-contact-form": {
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

/**
 * Flag type categories for different evaluation strategies
 */
export type FlagType = "runtime" | "build-time";

/**
 * Metadata for each feature flag (descriptions, type info)
 * Co-located with type definitions to maintain single source of truth
 */
export interface FlagMetadata {
  description: string;
  type: FlagType;
}

export const FLAG_METADATA: Record<keyof FeatureFlags, FlagMetadata> = {
  "email-contact-form": {
    description: "Email contact form with Postmark integration",
    type: "runtime",
  },
};
