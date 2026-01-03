/**
 * Unit tests for AdminFlagsPage component
 */

import "@testing-library/jest-dom/vitest";

import type { FeatureFlags } from "@/types/featureFlags.ts";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

  describe("rendering", () => {
    it("should render the page title", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      expect(screen.getByText("Feature Flags")).toBeInTheDocument();
    });

    it("should render the refresh button", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      expect(
        screen.getByRole("button", { name: /refresh/i }),
      ).toBeInTheDocument();
    });

    it("should render flags in a table", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("email-contact-form")).toBeInTheDocument();
    });

    it("should render table headers", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      expect(screen.getByText("Flag")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });
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

  describe("flag display", () => {
    it("should show enabled status for enabled flags", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: { "email-contact-form": { enabled: true } },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      expect(screen.getByText("Enabled")).toBeInTheDocument();
    });

    it("should show disabled status for disabled flags", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      expect(screen.getByText("Disabled")).toBeInTheDocument();
    });

    it("should show flag description", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      expect(
        screen.getByText("Email contact form with Postmark integration"),
      ).toBeInTheDocument();
    });
  });

  describe("refresh functionality", () => {
    it("should call refetch when refresh button is clicked", async () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      const refreshButton = screen.getByRole("button", {
        name: /refresh feature flags/i,
      });
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(1);
      });
    });

    it("should disable button while refreshing", async () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      const refreshButton = screen.getByRole("button", {
        name: /refresh feature flags/i,
      });
      fireEvent.click(refreshButton);

      expect(refreshButton).toBeDisabled();
    });

    it("should show Refreshing text while refreshing", async () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      const refreshButton = screen.getByRole("button", {
        name: /refresh feature flags/i,
      });
      fireEvent.click(refreshButton);

      expect(screen.getByText("Refreshing...")).toBeInTheDocument();
    });

    it("should update last updated time after refresh", async () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      const refreshButton = screen.getByRole("button", {
        name: /refresh feature flags/i,
      });
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
      });
    });
  });

  describe("status bar", () => {
    it("should show connected status when no error", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      expect(
        screen.getByText("Connected to feature flags API"),
      ).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have accessible table structure", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      // Check for column headers
      const columnHeaders = screen.getAllByRole("columnheader");
      expect(columnHeaders).toHaveLength(3);
    });

    it("should have aria-label on refresh button", () => {
      mockUseFeatureFlags.mockReturnValue({
        flags: defaultFlags,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      render(<AdminFlagsPage />);

      const button = screen.getByRole("button", {
        name: /refresh feature flags/i,
      });
      expect(button).toHaveAttribute("aria-label", "Refresh feature flags");
    });
  });
});
