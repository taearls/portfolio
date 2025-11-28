/**
 * Unit tests for FeatureFlagWrapper component
 */

import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FeatureFlagWrapper from "@/components/FeatureFlagWrapper/FeatureFlagWrapper";
import * as useFeatureFlagsHook from "@/hooks/useFeatureFlags";
import type { FeatureFlags } from "@/types/featureFlags";

describe("FeatureFlagWrapper", () => {
  const mockUseFeatureFlags = vi.spyOn(useFeatureFlagsHook, "useFeatureFlags");

  const defaultFlags: FeatureFlags = {
    "email-contact-form": { enabled: false },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("when feature is enabled", () => {
    it("should render whenEnabled content", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: { "email-contact-form": { enabled: true } },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <FeatureFlagWrapper
          flagKey="email-contact-form"
          whenEnabled={<div>Feature is enabled</div>}
          whenDisabled={<div>Feature is disabled</div>}
        />
      );

      expect(screen.getByText("Feature is enabled")).toBeInTheDocument();
      expect(screen.queryByText("Feature is disabled")).not.toBeInTheDocument();
    });

    it("should not render whenDisabled content", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: { "email-contact-form": { enabled: true } },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <FeatureFlagWrapper
          flagKey="email-contact-form"
          whenEnabled={<div>Enabled</div>}
          whenDisabled={<div>Disabled</div>}
        />
      );

      expect(screen.queryByText("Disabled")).not.toBeInTheDocument();
    });
  });

  describe("when feature is disabled", () => {
    it("should render whenDisabled content", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <FeatureFlagWrapper
          flagKey="email-contact-form"
          whenEnabled={<div>Feature is enabled</div>}
          whenDisabled={<div>Feature is disabled</div>}
        />
      );

      expect(screen.getByText("Feature is disabled")).toBeInTheDocument();
      expect(screen.queryByText("Feature is enabled")).not.toBeInTheDocument();
    });

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
        />
      );

      expect(container.textContent).toBe("");
    });
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
        />
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
        />
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
        />
      );

      // Should show disabled content (default) when error occurs
      expect(screen.getByText("Disabled")).toBeInTheDocument();
    });
  });

  describe("complex content", () => {
    it("should render complex React elements when enabled", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: { "email-contact-form": { enabled: true } },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <FeatureFlagWrapper
          flagKey="email-contact-form"
          whenEnabled={
            <div>
              <h1>Contact Form</h1>
              <p>Send us a message</p>
            </div>
          }
        />
      );

      expect(screen.getByText("Contact Form")).toBeInTheDocument();
      expect(screen.getByText("Send us a message")).toBeInTheDocument();
    });

    it("should render complex React elements when disabled", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <FeatureFlagWrapper
          flagKey="email-contact-form"
          whenEnabled={<div>Form</div>}
          whenDisabled={
            <div>
              <h2>Coming Soon</h2>
              <p>This feature is not available yet</p>
            </div>
          }
        />
      );

      expect(screen.getByText("Coming Soon")).toBeInTheDocument();
      expect(screen.getByText("This feature is not available yet")).toBeInTheDocument();
    });
  });

  describe("flag key types", () => {
    it("should work with email-contact-form flag", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: { "email-contact-form": { enabled: true } },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <FeatureFlagWrapper
          flagKey="email-contact-form"
          whenEnabled={<div>Contact form enabled</div>}
        />
      );

      expect(screen.getByText("Contact form enabled")).toBeInTheDocument();
    });
  });

  describe("integration scenarios", () => {
    it("should handle rapid flag changes", () => {
      const { rerender } = render(
        <FeatureFlagWrapper
          flagKey="email-contact-form"
          whenEnabled={<div>Enabled</div>}
          whenDisabled={<div>Disabled</div>}
        />
      );

      // Initially disabled
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      rerender(
        <FeatureFlagWrapper
          flagKey="email-contact-form"
          whenEnabled={<div>Enabled</div>}
          whenDisabled={<div>Disabled</div>}
        />
      );

      expect(screen.getByText("Disabled")).toBeInTheDocument();

      // Then enabled
      mockUseFeatureFlags.mockReturnValue({
        flags: { "email-contact-form": { enabled: true } },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      rerender(
        <FeatureFlagWrapper
          flagKey="email-contact-form"
          whenEnabled={<div>Enabled</div>}
          whenDisabled={<div>Disabled</div>}
        />
      );

      expect(screen.getByText("Enabled")).toBeInTheDocument();
    });
  });
});
