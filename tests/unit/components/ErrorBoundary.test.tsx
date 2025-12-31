/**
 * Unit tests for ErrorBoundary component
 */

import "@testing-library/jest-dom/vitest";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary.tsx";

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error message");
  }
  return <div>Child content</div>;
}

describe("ErrorBoundary", () => {
  // Suppress console.error during tests since we're testing error handling
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  describe("when no error occurs", () => {
    it("should render children normally", () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>,
      );

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });
  });

  describe("when an error occurs", () => {
    it("should display fallback UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(
        screen.getByText("An unexpected error occurred. Please try again."),
      ).toBeInTheDocument();
    });

    it("should display error message", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("should display Try Again button", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(
        screen.getByRole("button", { name: /try again/i }),
      ).toBeInTheDocument();
    });

    it("should reset error state when Try Again is clicked", () => {
      let shouldThrow = true;

      function ConditionalThrow() {
        if (shouldThrow) {
          throw new Error("Test error message");
        }
        return <div>Child content</div>;
      }

      render(
        <ErrorBoundary>
          <ConditionalThrow />
        </ErrorBoundary>,
      );

      // Verify error UI is shown
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      // Change condition before clicking Try Again
      shouldThrow = false;

      // Click Try Again - this should reset and re-render successfully
      fireEvent.click(screen.getByRole("button", { name: /try again/i }));

      expect(screen.getByText("Child content")).toBeInTheDocument();
      expect(
        screen.queryByText("Something went wrong"),
      ).not.toBeInTheDocument();
    });

    it("should log error to console", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("custom fallback", () => {
    it("should render custom fallback when provided", () => {
      render(
        <ErrorBoundary fallback={<div>Custom error message</div>}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(screen.getByText("Custom error message")).toBeInTheDocument();
      expect(
        screen.queryByText("Something went wrong"),
      ).not.toBeInTheDocument();
    });
  });
});
