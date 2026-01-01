import "@testing-library/jest-dom/vitest";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ActionButton from "@/components/ActionButton/ActionButton.tsx";

describe("ActionButton", () => {
  describe("rendering", () => {
    it("should render with children text", () => {
      render(<ActionButton onClick={() => {}}>Click Me</ActionButton>);

      expect(
        screen.getByRole("button", { name: "Click Me" }),
      ).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <ActionButton onClick={() => {}} className="custom-class">
          Click Me
        </ActionButton>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("should render as submit type when specified", () => {
      render(
        <ActionButton onClick={() => {}} type="submit">
          Submit
        </ActionButton>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should default to button type", () => {
      render(<ActionButton onClick={() => {}}>Click Me</ActionButton>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });
  });

  describe("disabled state", () => {
    it("should be disabled when disabled prop is true", () => {
      render(
        <ActionButton onClick={() => {}} disabled>
          Click Me
        </ActionButton>,
      );

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <ActionButton onClick={handleClick} disabled>
          Click Me
        </ActionButton>,
      );

      await user.click(screen.getByRole("button"));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("loading state", () => {
    it("should show loading label when externally controlled loading is true", () => {
      render(
        <ActionButton onClick={() => {}} isLoading loadingLabel="Loading...">
          Click Me
        </ActionButton>,
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByText("Click Me")).not.toBeInTheDocument();
    });

    it("should be disabled when loading", () => {
      render(
        <ActionButton onClick={() => {}} isLoading>
          Click Me
        </ActionButton>,
      );

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should use default loading label when not provided", () => {
      render(
        <ActionButton onClick={() => {}} isLoading>
          Click Me
        </ActionButton>,
      );

      expect(screen.getByText("Processing...")).toBeInTheDocument();
    });

    it("should set aria-label when loading", () => {
      render(
        <ActionButton onClick={() => {}} isLoading loadingLabel="Please wait">
          Click Me
        </ActionButton>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Please wait");
    });
  });

  describe("async onClick behavior", () => {
    it("should handle synchronous onClick", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ActionButton onClick={handleClick}>Click Me</ActionButton>);

      await user.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should handle async onClick and show loading state", async () => {
      const user = userEvent.setup();
      let resolvePromise: () => void;
      const promise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });

      const handleClick = vi.fn(() => promise);

      render(
        <ActionButton onClick={handleClick} loadingLabel="Working...">
          Click Me
        </ActionButton>,
      );

      const button = screen.getByRole("button");
      await user.click(button);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText("Working...")).toBeInTheDocument();
      });
      expect(button).toBeDisabled();

      // Resolve the promise
      resolvePromise!();

      // Should return to normal state
      await waitFor(() => {
        expect(screen.getByText("Click Me")).toBeInTheDocument();
      });
      expect(button).not.toBeDisabled();
    });

    it("should prevent rapid clicks during async operation", async () => {
      const user = userEvent.setup();
      let resolvePromise: () => void;
      const promise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });

      const handleClick = vi.fn(() => promise);

      render(<ActionButton onClick={handleClick}>Click Me</ActionButton>);

      const button = screen.getByRole("button");

      // First click
      await user.click(button);

      // Try to click again while loading
      await user.click(button);
      await user.click(button);

      // onClick should only be called once
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Resolve the promise
      resolvePromise!();

      await waitFor(() => {
        expect(screen.getByText("Click Me")).toBeInTheDocument();
      });
    });

    it("should log errors and reset loading state on error", async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Don't reject the promise - just throw an error synchronously
      const testError = new Error("Test error");
      const handleClick = vi.fn(() => {
        throw testError;
      });

      render(<ActionButton onClick={handleClick}>Click Me</ActionButton>);

      const button = screen.getByRole("button");

      // Click the button - this will trigger the error
      await user.click(button);

      // Wait for error to be logged by ActionButton
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "ActionButton: Error during onClick:",
          testError,
        );
      });

      // Loading state should be reset even after error
      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("accessibility", () => {
    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ActionButton onClick={handleClick}>Click Me</ActionButton>);

      const button = screen.getByRole("button");

      // Focus the button
      button.focus();
      expect(button).toHaveFocus();

      // Press Enter
      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Press Space
      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it("should have proper ARIA attributes when loading", () => {
      render(
        <ActionButton onClick={() => {}} isLoading loadingLabel="Loading data">
          Click Me
        </ActionButton>,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Loading data");
      expect(button).toBeDisabled();
    });
  });
});
