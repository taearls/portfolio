import type { FeatureFlags } from "@/types/featureFlags.ts";
import type { ReactNode } from "react";

import { useFeatureFlags } from "@/hooks/useFeatureFlags.ts";

interface FeatureFlagWrapperProps {
  /**
   * The feature flag key to check
   */
  flagKey: keyof FeatureFlags;

  /**
   * Component to render when the feature flag is enabled
   */
  whenEnabled: ReactNode;

  /**
   * Component to render when the feature flag is disabled or undefined
   */
  whenDisabled?: ReactNode;

  /**
   * Optional component to show while feature flags are loading
   */
  whenLoading?: ReactNode;
}

/**
 * FeatureFlagWrapper - Conditionally renders components based on feature flag state
 *
 * @example
 * ```tsx
 * <FeatureFlagWrapper
 *   flagKey="contactForm"
 *   whenEnabled={<ContactForm />}
 *   whenDisabled={<ComingSoonMessage />}
 *   whenLoading={<LoadingSpinner />}
 * />
 * ```
 */
const FeatureFlagWrapper = ({
  flagKey,
  whenEnabled,
  whenDisabled = null,
  whenLoading = null,
}: FeatureFlagWrapperProps) => {
  const { flags, isLoading } = useFeatureFlags();
  const flagConfig = flags[flagKey];
  const enabled = flagConfig?.enabled ?? false;

  if (isLoading && whenLoading != null) {
    return <>{whenLoading}</>;
  }

  return <>{enabled ? whenEnabled : whenDisabled}</>;
};

export default FeatureFlagWrapper;
