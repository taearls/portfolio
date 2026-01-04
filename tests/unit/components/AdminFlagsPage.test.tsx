/**
 * Unit tests for AdminFlagsPage component
 *
 * Focus: Error and loading UI states
 * Note: Flag rendering, refresh functionality, and accessibility are covered by integration tests
 */

import "@testing-library/jest-dom/vitest";

import type { FeatureFlags } from "@/types/featureFlags.ts";

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as useFeatureFlagsHook from "@/hooks/useFeatureFlags.ts";
import AdminFlagsPage from "@/pages/AdminFlagsPage/AdminFlagsPage.tsx";

describe("AdminFlagsPage", () => {
  const mockUseFeatureFlags = vi.spyOn(useFeatureFlagsHook, "useFeatureFlags");
  const mockRefetch = vi.fn().mockResolvedValue(undefined);

  const defaultFlags: FeatureFlags = {
    "email-contact-form": { enabled: false },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("loading state", () => {
    it("should show loading message on initial load", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: true,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      expect(screen.getByText("Loading feature flags...")).toBeInTheDocument();
    });

    it("should not show table while loading initially", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: true,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("should display error message when error occurs", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: new Error("Network error"),
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      expect(
        screen.getByText(/Failed to load flags: Network error/),
      ).toBeInTheDocument();
    });

    it("should show Try Again button when error occurs", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: new Error("Network error"),
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      expect(screen.getByText("Try Again")).toBeInTheDocument();
    });

    it("should show connection error in status bar", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: new Error("Network error"),
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      expect(screen.getByText("Connection error")).toBeInTheDocument();
    });
  });
});
