/**
 * Integration tests for Contact Form functionality
 *
 * These tests use localStorage cache pre-population instead of cy.intercept + cy.wait
 * to avoid cross-origin interception issues when the feature flags API runs on a
 * different port (localhost:8787) than the app (localhost:4173).
 *
 * Uses cy.setFlagsCache() command from support/support.ts
 * Uses FLAG_TEST_MATRIX for parametrized testing across flag states
 */

import type { FeatureFlags } from "../../src/types/featureFlags.ts";

import {
  FLAG_TEST_MATRIX,
  forEachScenario,
  getScenario,
} from "./support/test-matrix.ts";

describe("Contact Form Integration", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  describe("Form Display with Feature Flag (Matrix Pattern)", () => {
    /**
     * Parametrized tests using FLAG_TEST_MATRIX
     * Covers all flag states: enabled, disabled, disabledNoMessage
     */
    forEachScenario((scenario) => {
      it(`${scenario.description}`, () => {
        cy.setFlagsCache(scenario.flags);
        cy.visit("/contact");

        // Assert form visibility based on scenario expectations
        if (scenario.expectations.formVisible) {
          cy.get("#contact-email-form").should("be.visible");
          cy.get("#contactName").should("be.visible");
          cy.get("#contactEmail").should("be.visible");
          cy.get("#contactMessage").should("be.visible");
        } else {
          cy.get("#contact-email-form").should("not.exist");
        }

        // Assert message display based on scenario expectations
        if (
          scenario.expectations.showsMessage &&
          scenario.expectations.messageText
        ) {
          cy.contains(scenario.expectations.messageText).should("be.visible");
        }
      });
    });
  });

  describe("Form Validation", () => {
    beforeEach(() => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      cy.setFlagsCache(enabledScenario.flags);

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");

      // Wait for form to be visible before running tests
      cy.get("#contact-email-form").should("be.visible");
    });

    it("disables submit button when form is incomplete", () => {
      cy.get('button[type="submit"]').should("be.disabled");

      cy.get("#contactName").type("John Doe");
      cy.get('button[type="submit"]').should("be.disabled");

      cy.get("#contactEmail").type("john@example.com");
      cy.get('button[type="submit"]').should("be.disabled");
    });

    it("shows email validation error for invalid email", () => {
      cy.get("#contactEmail").type("invalid-email");
      cy.get("#contactEmail").blur();

      cy.contains("Please enter a valid email").should("be.visible");
    });

    it("clears email error when valid email is entered", () => {
      cy.get("#contactEmail").type("invalid-email");
      cy.get("#contactEmail").blur();

      cy.contains("Please enter a valid email").should("be.visible");

      cy.get("#contactEmail").clear();
      cy.get("#contactEmail").type("valid@example.com");

      cy.contains("Please enter a valid email").should("not.exist");
    });

    it("shows character count for message field", () => {
      cy.contains("0/5000 characters").should("be.visible");

      cy.get("#contactMessage").type("Hello world!");

      cy.contains("12/5000 characters").should("be.visible");
    });
  });

  describe("Form Submission", () => {
    beforeEach(() => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      cy.setFlagsCache(enabledScenario.flags);

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");

      // Wait for form to be visible before running tests
      cy.get("#contact-email-form").should("be.visible");
    });

    it("submits form successfully", () => {
      // Use glob pattern for cross-origin interception
      cy.intercept("POST", "**/api/contact", {
        statusCode: 200,
        body: { success: true, message: "Message sent successfully" },
      }).as("submitForm");

      // Fill out the form
      cy.fillContactForm({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello, this is a test message!",
      });

      // Wait for Turnstile to complete (uses test key that auto-passes)
      cy.waitForFormReady();

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Verify success message appears (UI-based assertion instead of cy.wait)
      cy.contains("Message sent successfully").should("be.visible");

      // Form should be reset after successful submission
      cy.get("#contactName").should("have.value", "");
      cy.get("#contactEmail").should("have.value", "");
      cy.get("#contactMessage").should("have.value", "");
    });

    it("shows error on server failure", () => {
      // Use glob pattern for cross-origin interception
      cy.intercept("POST", "**/api/contact", {
        statusCode: 500,
        body: { success: false, error: "Failed to send message" },
      }).as("submitForm");

      // Fill out the form
      cy.fillContactForm({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello!",
      });

      // Wait for Turnstile and submit
      cy.waitForFormReady();
      cy.get('button[type="submit"]').click();

      // Verify error message appears (UI-based assertion instead of cy.wait)
      cy.contains("Failed to send message").should("be.visible");
    });

    it("shows rate limit error", () => {
      // Use glob pattern for cross-origin interception
      cy.intercept("POST", "**/api/contact", {
        statusCode: 429,
        body: { success: false, error: "Rate limited", retryAfter: 3600 },
      }).as("submitForm");

      // Fill out the form
      cy.fillContactForm({
        name: "Jane Doe",
        email: "jane@example.com",
        message: "Please respond!",
      });

      // Wait for Turnstile and submit
      cy.waitForFormReady();
      cy.get('button[type="submit"]').click();

      // Verify rate limit error message appears (UI-based assertion instead of cy.wait)
      // The component shows "Too many requests. Please try again in X seconds."
      cy.contains("Too many requests").should("be.visible");
    });

    it("shows loading state while submitting", () => {
      // Use glob pattern for cross-origin interception with delay
      cy.intercept("POST", "**/api/contact", {
        delay: 1000,
        statusCode: 200,
        body: { success: true, message: "Message sent successfully" },
      }).as("submitForm");

      cy.fillContactForm({
        name: "Test User",
        email: "test@example.com",
        message: "Testing loading state",
      });

      cy.waitForFormReady();
      cy.get('button[type="submit"]').click();

      // Button should show loading state immediately after click
      cy.get('button[type="submit"]').should("be.disabled");
      cy.contains("Sending").should("be.visible");

      // Eventually the success message should appear
      cy.contains("Message sent successfully").should("be.visible");
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      cy.setFlagsCache(enabledScenario.flags);

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");

      // Wait for form to be visible before running tests
      cy.get("#contact-email-form").should("be.visible");
    });

    it("has proper form labels", () => {
      cy.get('label[for="contactName"]').should("contain", "Name");
      cy.get('label[for="contactEmail"]').should("contain", "Email");
      cy.get('label[for="contactMessage"]').should("contain", "Message");
    });

    it("has required field indicators", () => {
      cy.get("#contactName").should("have.attr", "aria-required", "true");
      cy.get("#contactEmail").should("have.attr", "aria-required", "true");
      cy.get("#contactMessage").should("have.attr", "aria-required", "true");
    });

    it("has screen reader only legend", () => {
      cy.get("legend").should("have.class", "sr-only");
      cy.get("legend").should("contain", "Contact Form");
    });

    it("marks email field as invalid when validation fails", () => {
      cy.get("#contactEmail").type("invalid-email");
      cy.get("#contactEmail").blur();

      cy.get("#contactEmail").should("have.attr", "aria-invalid", "true");
    });
  });

  describe("Turnstile Widget", () => {
    beforeEach(() => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      cy.setFlagsCache(enabledScenario.flags);

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");

      // Wait for form to be visible before running tests
      cy.get("#contact-email-form").should("be.visible");
    });

    it("renders Turnstile widget", () => {
      // Turnstile widget should be rendered as an iframe
      cy.get('iframe[src*="turnstile"]').should("exist");
    });

    it("enables submit button after Turnstile passes and form is valid", () => {
      // Button requires both valid form fields AND Turnstile token
      // Fill the form first
      cy.fillContactForm({
        name: "Test User",
        email: "test@example.com",
        message: "Testing Turnstile validation",
      });

      // With mock Turnstile, the token is set after 100ms
      // Wait for Turnstile to pass and button to become enabled
      cy.waitForTurnstile();
      cy.get('button[type="submit"]').should("not.be.disabled");
    });

    it("resets Turnstile after successful submission", () => {
      // Use glob pattern for cross-origin interception
      cy.intercept("POST", "**/api/contact", {
        statusCode: 200,
        body: { success: true, message: "Message sent successfully" },
      }).as("submitForm");

      // Fill form and submit
      cy.fillContactForm({
        name: "Test User",
        email: "test@example.com",
        message: "Testing Turnstile reset",
      });
      cy.waitForFormReady();
      cy.get('button[type="submit"]').click();

      // Verify success message appears (UI-based assertion instead of cy.wait)
      cy.contains("Message sent successfully").should("be.visible");

      // After success, form resets and Turnstile should re-render
      cy.get('iframe[src*="turnstile"]').should("exist");
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      cy.setFlagsCache(enabledScenario.flags);

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");

      // Wait for form to be visible before running tests
      cy.get("#contact-email-form").should("be.visible");
    });

    it("handles network error gracefully", () => {
      // Use glob pattern for cross-origin interception
      cy.intercept("POST", "**/api/contact", {
        forceNetworkError: true,
      }).as("submitForm");

      cy.fillContactForm({
        name: "Test User",
        email: "test@example.com",
        message: "Testing network error",
      });
      cy.waitForFormReady();
      cy.get('button[type="submit"]').click();

      // Should show a user-friendly error message (UI-based assertion)
      cy.contains(/error|failed|try again/i).should("be.visible");
    });

    it("handles validation errors from server", () => {
      // Use glob pattern for cross-origin interception
      cy.intercept("POST", "**/api/contact", {
        statusCode: 400,
        body: {
          success: false,
          error: "Validation failed",
          details: ["Email is invalid"],
        },
      }).as("submitForm");

      cy.fillContactForm({
        name: "Test User",
        email: "test@example.com",
        message: "Testing validation error",
      });
      cy.waitForFormReady();
      cy.get('button[type="submit"]').click();

      // Verify validation error appears (UI-based assertion instead of cy.wait)
      cy.contains(/validation failed|invalid/i).should("be.visible");
    });

    it("clears error message on retry", () => {
      // First submission fails - use glob pattern for cross-origin interception
      cy.intercept("POST", "**/api/contact", {
        statusCode: 500,
        body: { success: false, error: "Server error" },
      }).as("submitFormFail");

      cy.fillContactForm({
        name: "Test User",
        email: "test@example.com",
        message: "First attempt",
      });
      cy.waitForFormReady();
      cy.get('button[type="submit"]').click();

      // Verify error appears (UI-based assertion instead of cy.wait)
      cy.contains("Server error").should("be.visible");

      // Second submission succeeds - use glob pattern for cross-origin interception
      cy.intercept("POST", "**/api/contact", {
        statusCode: 200,
        body: { success: true, message: "Message sent successfully" },
      }).as("submitFormSuccess");

      // Re-fill form (it may have been partially reset)
      cy.fillContactForm({
        name: "Test User",
        email: "test@example.com",
        message: "Second attempt",
      });
      cy.waitForFormReady();
      cy.get('button[type="submit"]').click();

      // Verify success message appears (UI-based assertion instead of cy.wait)
      cy.contains("Message sent successfully").should("be.visible");
      // Error should be cleared
      cy.contains("Server error").should("not.exist");
    });
  });

  describe("Dark Mode Support", () => {
    beforeEach(() => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      cy.setFlagsCache(enabledScenario.flags);

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");

      // Wait for form to be visible before running tests
      cy.get("#contact-email-form").should("be.visible");
    });

    it("form is visible in light mode", () => {
      cy.get("#contact-email-form").should("be.visible");
      cy.get("#contactName").should("be.visible");
      cy.get("#contactEmail").should("be.visible");
      cy.get("#contactMessage").should("be.visible");
    });

    it("form is visible in dark mode", () => {
      // Toggle dark mode using document class directly (more reliable across viewports)
      cy.document().then((doc) => {
        doc.documentElement.classList.add("dark");
      });

      // Verify dark mode is active
      cy.get("html").should("have.class", "dark");

      // Form should still be visible
      cy.get("#contact-email-form").should("be.visible");
      cy.get("#contactName").should("be.visible");
      cy.get("#contactEmail").should("be.visible");
      cy.get("#contactMessage").should("be.visible");
    });

    it("maintains functionality in dark mode", () => {
      // Toggle dark mode using document class directly
      cy.document().then((doc) => {
        doc.documentElement.classList.add("dark");
      });

      cy.get("html").should("have.class", "dark");

      // Test form validation still works
      cy.get("#contactEmail").type("invalid-email");
      cy.get("#contactEmail").blur();
      cy.contains("Please enter a valid email").should("be.visible");
    });
  });

  describe("Contact Page Content", () => {
    beforeEach(() => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      cy.setFlagsCache(enabledScenario.flags);

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");

      // Wait for form to be visible before running tests
      cy.get("#contact-email-form").should("be.visible");
    });

    it("displays contact page heading", () => {
      cy.contains("Contact Tyler Earls").should("be.visible");
    });

    it("displays email address link", () => {
      cy.contains("tyler.a.earls@gmail.com").should("be.visible");
      cy.get('a[href="mailto:tyler.a.earls@gmail.com"]').should("exist");
    });

    it("displays introductory text", () => {
      cy.contains("interested in hiring me").should("be.visible");
    });
  });
});
