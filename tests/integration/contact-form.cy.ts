/**
 * Integration tests for Contact Form functionality
 */

import type { FeatureFlags } from "../../src/types/featureFlags.ts";

describe("Contact Form Integration", () => {
  const FEATURE_FLAGS_API_URL = "http://localhost:8787/api/flags";
  const CONTACT_API_URL = "http://localhost:8788/api/contact";

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  describe("Form Display with Feature Flag", () => {
    it("shows contact form when feature flag is enabled", () => {
      const mockFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: true,
        },
      };

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: mockFlags,
      }).as("getFlags");

      cy.visit("/contact");
      cy.wait("@getFlags");

      // Form should be visible
      cy.get("#contact-email-form").should("be.visible");
      cy.get("#contactName").should("be.visible");
      cy.get("#contactEmail").should("be.visible");
      cy.get("#contactMessage").should("be.visible");
    });

    it("hides contact form when feature flag is disabled", () => {
      const mockFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: false,
        },
      };

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: mockFlags,
      }).as("getFlags");

      cy.visit("/contact");
      cy.wait("@getFlags");

      // Form should not be visible
      cy.get("#contact-email-form").should("not.exist");
    });
  });

  describe("Form Validation", () => {
    beforeEach(() => {
      const mockFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: true,
        },
      };

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: mockFlags,
      }).as("getFlags");

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");
      cy.wait("@getFlags");
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
      const mockFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: true,
        },
      };

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: mockFlags,
      }).as("getFlags");

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");
      cy.wait("@getFlags");
    });

    it("submits form successfully", () => {
      cy.intercept("POST", CONTACT_API_URL, {
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

      // Wait for API call and verify success
      cy.wait("@submitForm");
      cy.contains("Message sent successfully").should("be.visible");

      // Form should be reset after successful submission
      cy.get("#contactName").should("have.value", "");
      cy.get("#contactEmail").should("have.value", "");
      cy.get("#contactMessage").should("have.value", "");
    });

    it("shows error on server failure", () => {
      cy.intercept("POST", CONTACT_API_URL, {
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

      // Wait for API call and verify error is shown
      cy.wait("@submitForm");
      cy.contains("Failed to send message").should("be.visible");
    });

    it("shows rate limit error", () => {
      cy.intercept("POST", CONTACT_API_URL, {
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

      // Wait for API call and verify rate limit error
      // The component shows "Too many requests. Please try again in X seconds."
      cy.wait("@submitForm");
      cy.contains("Too many requests").should("be.visible");
    });

    it("shows loading state while submitting", () => {
      // Delay the response to observe loading state
      cy.intercept("POST", CONTACT_API_URL, {
        delay: 500,
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

      // Button should show loading state
      cy.get('button[type="submit"]').should("be.disabled");
      cy.contains("Sending").should("be.visible");

      cy.wait("@submitForm");
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      const mockFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: true,
        },
      };

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: mockFlags,
      }).as("getFlags");

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");
      cy.wait("@getFlags");
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
      const mockFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: true,
        },
      };

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: mockFlags,
      }).as("getFlags");

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");
      cy.wait("@getFlags");
    });

    it("renders Turnstile widget", () => {
      // Turnstile widget should be rendered as an iframe
      cy.get('iframe[src*="turnstile"]', { timeout: 10000 }).should("exist");
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
      cy.intercept("POST", CONTACT_API_URL, {
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

      cy.wait("@submitForm");

      // After success, form resets and Turnstile should re-render
      cy.get('iframe[src*="turnstile"]', { timeout: 10000 }).should("exist");
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      const mockFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: true,
        },
      };

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: mockFlags,
      }).as("getFlags");

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");
      cy.wait("@getFlags");
    });

    it("handles network error gracefully", () => {
      cy.intercept("POST", CONTACT_API_URL, {
        forceNetworkError: true,
      }).as("submitForm");

      cy.fillContactForm({
        name: "Test User",
        email: "test@example.com",
        message: "Testing network error",
      });
      cy.waitForFormReady();
      cy.get('button[type="submit"]').click();

      // Should show a user-friendly error message
      cy.contains(/error|failed|try again/i, { timeout: 5000 }).should(
        "be.visible",
      );
    });

    it("handles validation errors from server", () => {
      cy.intercept("POST", CONTACT_API_URL, {
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

      cy.wait("@submitForm");
      cy.contains(/validation failed|invalid/i).should("be.visible");
    });

    it("clears error message on retry", () => {
      // First submission fails
      cy.intercept("POST", CONTACT_API_URL, {
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

      cy.wait("@submitFormFail");
      cy.contains("Server error").should("be.visible");

      // Second submission succeeds
      cy.intercept("POST", CONTACT_API_URL, {
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

      cy.wait("@submitFormSuccess");
      // Error should be cleared and success shown
      cy.contains("Server error").should("not.exist");
      cy.contains("Message sent successfully").should("be.visible");
    });
  });

  describe("Dark Mode Support", () => {
    beforeEach(() => {
      const mockFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: true,
        },
      };

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: mockFlags,
      }).as("getFlags");

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");
      cy.wait("@getFlags");
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
      const mockFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: true,
        },
      };

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: mockFlags,
      }).as("getFlags");

      // Stub Turnstile before visiting the page
      cy.stubTurnstile();

      cy.visit("/contact");
      cy.wait("@getFlags");
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
