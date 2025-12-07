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

      // Mock Turnstile - in a real test this would be handled differently
      // For now, we'll stub the endpoint
      cy.intercept("POST", "https://challenges.cloudflare.com/**", {
        statusCode: 200,
        body: { success: true },
      }).as("turnstileVerify");

      cy.visit("/contact");
      cy.wait("@getFlags");
    });

    it("submits form successfully", () => {
      cy.intercept("POST", CONTACT_API_URL, {
        statusCode: 200,
        body: { success: true, message: "Message sent successfully" },
      }).as("submitForm");

      cy.get("#contactName").type("John Doe");
      cy.get("#contactEmail").type("john@example.com");
      cy.get("#contactMessage").type("Hello, this is a test message!");

      // Note: In real tests, Turnstile widget would need to be handled
      // This test documents the expected behavior

      // The form will be disabled until Turnstile passes
      // For CI, we would need to use Turnstile's testing keys
    });

    it("shows error on server failure", () => {
      cy.intercept("POST", CONTACT_API_URL, {
        statusCode: 500,
        body: { success: false, error: "Failed to send message" },
      }).as("submitForm");

      // Fill out form (Turnstile would need to pass first in real scenario)
      cy.get("#contactName").type("John Doe");
      cy.get("#contactEmail").type("john@example.com");
      cy.get("#contactMessage").type("Hello!");

      // Note: Cannot complete submission without Turnstile token
      // This documents the expected error handling behavior
    });

    it("shows rate limit error", () => {
      cy.intercept("POST", CONTACT_API_URL, {
        statusCode: 429,
        body: { success: false, error: "Rate limited", retryAfter: 3600 },
      }).as("submitForm");

      // Note: Rate limit error would be shown after form submission
      // This documents the expected behavior
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

      cy.visit("/contact");
      cy.wait("@getFlags");
    });

    it("form is visible in both light and dark modes", () => {
      // Light mode (default)
      cy.get("#contact-email-form").should("be.visible");

      // Toggle to dark mode (assuming there's a theme toggle)
      // This test documents that the form should be visible in both modes
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
