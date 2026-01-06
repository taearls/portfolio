/**
 * Unit tests for FeatureFlagWrapper component
 *
 * Focus: Loading state transitions and error handling
 * Note: Feature enabled/disabled rendering is covered by integration tests
 */

import "@testing-library/jest-dom/vitest";

import type { FeatureFlags } from "@/types/featureFlags.ts";

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import FeatureFlagWrapper from "@/components/FeatureFlagWrapper/FeatureFlagWrapper.tsx";
import * as useFeatureFlagsHook from "@/hooks/useFeatureFlags.ts";

describe("FeatureFlagWrapper", () => {
  const mockUseFeatureFlags = vi.spyOn(useFeatureFlagsHook, "useFeatureFlags");

  const defaultFlags: FeatureFlags = {
    "email-contact-form": { enabled: false },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("loading state", () => {
    it("should render whenLoading content while loading", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <FeatureFlagWrapper
          flagKey="email-contact-form"
          whenEnabled={<div>Enabled</div>}
          whenDisabled={<div>Disabled</div>}
          whenLoading={<div>Loading...</div>}
        />,
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByText("Enabled")).not.toBeInTheDocument();
      expect(screen.queryByText("Disabled")).not.toBeInTheDocument();
    });

    it("should render based on flag state when loading and no whenLoading provided", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: { "email-contact-form": { enabled: true } },
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <FeatureFlagWrapper
          flagKey="email-contact-form"
          whenEnabled={<div>Enabled</div>}
          whenDisabled={<div>Disabled</div>}
        />,
      );

      // Should show enabled content even while loading if whenLoading is not provided
      expect(screen.getByText("Enabled")).toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("should still render based on flag state when there is an error", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: new Error("Failed to fetch flags"),
        refetch: vi.fn(),
      });

      render(
        <FeatureFlagWrapper
          flagKey="email-contact-form"
          whenEnabled={<div>Enabled</div>}
          whenDisabled={<div>Disabled</div>}
        />,
      );

      // Should show disabled content (default) when error occurs
      expect(screen.getByText("Disabled")).toBeInTheDocument();
    });
  });

  describe("when feature is disabled", () => {
    it("should render nothing when whenDisabled is not provided", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const { container } = render(
        <FeatureFlagWrapper
          flagKey="email-contact-form"
          whenEnabled={<div>Enabled</div>}
        />,
      );

      expect(container.textContent).toBe("");
    });
  });
});
