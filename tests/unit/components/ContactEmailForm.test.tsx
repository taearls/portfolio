/**
 * Unit tests for ContactEmailForm component
 *
 * Note: Turnstile widget integration is mocked for unit tests.
 * Full end-to-end testing with Turnstile should use Cypress with test keys.
 */

import "@testing-library/jest-dom/vitest";

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ContactEmailForm from "@/components/ContactEmailForm.tsx";

// Store Turnstile callbacks for testing
let turnstileOnSuccess: ((token: string) => void) | null = null;
let turnstileOnError: (() => void) | null = null;

// Mock @marsidev/react-turnstile
vi.mock("@marsidev/react-turnstile", () => ({
  Turnstile: vi.fn(({ onSuccess, onError }) => {
    // Store callbacks for manual triggering
    turnstileOnSuccess = onSuccess;
    turnstileOnError = onError;
    return <div data-testid="turnstile-widget">Turnstile Widget</div>;
  }),
}));

// Mock fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Helper to simulate Turnstile success (must be called within act())
const simulateTurnstileSuccess = () => {
  if (turnstileOnSuccess) {
    turnstileOnSuccess("mock-turnstile-token");
  }
};

// Helper to simulate Turnstile error (must be called within act())
const simulateTurnstileError = () => {
  if (turnstileOnError) {
    turnstileOnError();
  }
};

describe("ContactEmailForm", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    turnstileOnSuccess = null;
    turnstileOnError = null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Form Rendering", () => {
    it("renders all form fields", () => {
      render(<ContactEmailForm />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /send message/i }),
      ).toBeInTheDocument();
    });

    it("renders Turnstile widget", () => {
      render(<ContactEmailForm />);

      expect(screen.getByTestId("turnstile-widget")).toBeInTheDocument();
    });

    it("disables submit button when form is invalid", () => {
      render(<ContactEmailForm />);

      const submitButton = screen.getByRole("button", {
        name: /send message/i,
      });
      expect(submitButton).toBeDisabled();
    });

    it("shows character counter for message field", () => {
      render(<ContactEmailForm />);

      expect(screen.getByText(/0\/5000 characters/i)).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("enables submit button when all fields are valid and Turnstile passes", async () => {
      render(<ContactEmailForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello!");

      // Simulate Turnstile success within act
      await act(async () => {
        simulateTurnstileSuccess();
      });

      const submitButton = screen.getByRole("button", {
        name: /send message/i,
      });
      expect(submitButton).toBeEnabled();
    });

    it("keeps submit button disabled without Turnstile token", async () => {
      render(<ContactEmailForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello!");

      // Don't simulate Turnstile success
      const submitButton = screen.getByRole("button", {
        name: /send message/i,
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Email Validation", () => {
    it("shows error for invalid email on blur", async () => {
      render(<ContactEmailForm />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "invalid-email");
      fireEvent.blur(emailInput);

      expect(
        screen.getByText(/please enter a valid email/i),
      ).toBeInTheDocument();
    });

    it("clears error when valid email is entered", async () => {
      render(<ContactEmailForm />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "invalid-email");
      fireEvent.blur(emailInput);

      expect(
        screen.getByText(/please enter a valid email/i),
      ).toBeInTheDocument();

      await user.clear(emailInput);
      await user.type(emailInput, "valid@example.com");

      expect(
        screen.queryByText(/please enter a valid email/i),
      ).not.toBeInTheDocument();
    });

    it("marks email field as aria-invalid when validation fails", async () => {
      render(<ContactEmailForm />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "invalid-email");
      fireEvent.blur(emailInput);

      expect(emailInput).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("Form Submission", () => {
    it("submits form successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      render(<ContactEmailForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello!");

      await act(async () => {
        simulateTurnstileSuccess();
      });

      await user.click(screen.getByRole("button", { name: /send message/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/message sent successfully/i),
        ).toBeInTheDocument();
      });
    });

    it("handles server error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Server error occurred" }),
      });

      render(<ContactEmailForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello!");

      await act(async () => {
        simulateTurnstileSuccess();
      });

      await user.click(screen.getByRole("button", { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/server error occurred/i)).toBeInTheDocument();
      });
    });

    it("handles rate limit error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: () =>
          Promise.resolve({ error: "Rate limited", retryAfter: 3600 }),
      });

      render(<ContactEmailForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello!");

      await act(async () => {
        simulateTurnstileSuccess();
      });

      await user.click(screen.getByRole("button", { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/too many requests/i)).toBeInTheDocument();
      });
    });

    it("handles validation errors from server", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            error: "Validation failed",
            details: ["Email is invalid", "Message too short"],
          }),
      });

      render(<ContactEmailForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello!");

      await act(async () => {
        simulateTurnstileSuccess();
      });

      await user.click(screen.getByRole("button", { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
        expect(screen.getByText(/message too short/i)).toBeInTheDocument();
      });
    });

    it("handles network error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      render(<ContactEmailForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello!");

      await act(async () => {
        simulateTurnstileSuccess();
      });

      await user.click(screen.getByRole("button", { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it("clears form on successful submission", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      render(<ContactEmailForm />);
      const user = userEvent.setup();

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(messageInput, "Hello!");

      await act(async () => {
        simulateTurnstileSuccess();
      });

      await user.click(screen.getByRole("button", { name: /send message/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/message sent successfully/i),
        ).toBeInTheDocument();
      });

      expect(nameInput).toHaveValue("");
      expect(emailInput).toHaveValue("");
      expect(messageInput).toHaveValue("");
    });
  });

  describe("Turnstile Integration", () => {
    it("shows error when Turnstile fails", async () => {
      render(<ContactEmailForm />);

      await act(async () => {
        simulateTurnstileError();
      });

      expect(screen.getByText(/verification failed/i)).toBeInTheDocument();
    });

    it("prevents submission without Turnstile token", async () => {
      render(<ContactEmailForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello!");

      // Don't simulate Turnstile success - button should be disabled
      const submitButton = screen.getByRole("button", {
        name: /send message/i,
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("has accessible form fields", () => {
      render(<ContactEmailForm />);

      expect(screen.getByLabelText(/name/i)).toHaveAttribute(
        "aria-required",
        "true",
      );
      expect(screen.getByLabelText(/email/i)).toHaveAttribute(
        "aria-required",
        "true",
      );
      expect(screen.getByLabelText(/message/i)).toHaveAttribute(
        "aria-required",
        "true",
      );
    });

    it("announces success message to screen readers", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      render(<ContactEmailForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello!");

      await act(async () => {
        simulateTurnstileSuccess();
      });

      await user.click(screen.getByRole("button", { name: /send message/i }));

      await waitFor(() => {
        const successAlert = screen.getByRole("alert");
        expect(successAlert).toBeInTheDocument();
        expect(successAlert).toHaveTextContent(/message sent successfully/i);
      });
    });

    it("announces error messages to screen readers", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Server error" }),
      });

      render(<ContactEmailForm />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello!");

      await act(async () => {
        simulateTurnstileSuccess();
      });

      await user.click(screen.getByRole("button", { name: /send message/i }));

      await waitFor(() => {
        const errorAlert = screen.getByRole("alert");
        expect(errorAlert).toBeInTheDocument();
      });
    });

    it("has screen reader only legend for fieldset", () => {
      render(<ContactEmailForm />);

      const legend = screen.getByText("Contact Form");
      expect(legend).toHaveClass("sr-only");
    });
  });

  describe("Character Counter", () => {
    it("updates character count as user types", async () => {
      render(<ContactEmailForm />);
      const user = userEvent.setup();

      expect(screen.getByText(/0\/5000 characters/i)).toBeInTheDocument();

      await user.type(screen.getByLabelText(/message/i), "Hello!");

      expect(screen.getByText(/6\/5000 characters/i)).toBeInTheDocument();
    });
  });
});
