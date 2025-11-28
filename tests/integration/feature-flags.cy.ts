/**
 * Integration tests for Feature Flags functionality
 */

import type { FeatureFlags } from "../../src/types/featureFlags";

describe("Feature Flags Integration", () => {
  const FEATURE_FLAGS_API_URL = "http://localhost:8787/api/flags";

  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  describe("Feature flag loading", () => {
    it("should fetch and display feature flags on app load", () => {
      const mockFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: true,
          message: "Contact form is now available!",
        },
      };

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: mockFlags,
      }).as("getFlags");

      cy.visit("/");

      cy.wait("@getFlags");

      // Verify flags were fetched
      cy.window().then((win) => {
        const cached = win.localStorage.getItem("portfolio:feature-flags");
        expect(cached).to.exist;

        const parsed = JSON.parse(cached!);
        expect(parsed.flags).to.deep.equal(mockFlags);
      });
    });

    it("should use cached flags when available", () => {
      const cachedFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: true,
          message: "Cached message",
        },
      };

      cy.window().then((win) => {
        win.localStorage.setItem(
          "portfolio:feature-flags",
          JSON.stringify({
            flags: cachedFlags,
            timestamp: Date.now(),
          }),
        );
      });

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: {
          "email-contact-form": {
            enabled: false,
          },
        },
      }).as("getFlags");

      cy.visit("/");

      // Cached flags should be used immediately (no wait for API)
      cy.window().then((win) => {
        const cached = win.localStorage.getItem("portfolio:feature-flags");
        expect(cached).to.exist;

        const parsed = JSON.parse(cached!);
        expect(parsed.flags."email-contact-form".enabled).to.equal(true);
      });
    });

    it("should handle API errors gracefully", () => {
      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 500,
        body: { error: "Internal Server Error" },
      }).as("getFlags");

      cy.visit("/");

      cy.wait("@getFlags");

      // App should still load with default flags
      cy.get("header").should("be.visible");
      cy.get("footer").should("be.visible");
    });

    it("should handle network timeout gracefully", () => {
      cy.intercept("GET", FEATURE_FLAGS_API_URL, (req) => {
        req.reply({
          delay: 10000, // 10 second delay (exceeds 5s timeout)
          statusCode: 200,
          body: {
            "email-contact-form": {
              enabled: true,
            },
          },
        });
      }).as("getFlags");

      cy.visit("/");

      // App should still load despite timeout
      cy.get("header").should("be.visible");
      cy.get("footer").should("be.visible");
    });
  });

  describe("Contact form flag behavior", () => {
    it("should respect contact form enabled flag", () => {
      const mockFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: true,
        },
      };

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: mockFlags,
      }).as("getFlags");

      cy.visit("/");
      cy.wait("@getFlags");

      // This test will be more meaningful once the contact form is implemented
      // For now, we just verify the flag is accessible
      cy.window().then((win) => {
        const cached = win.localStorage.getItem("portfolio:feature-flags");
        const parsed = JSON.parse(cached!);
        expect(parsed.flags."email-contact-form".enabled).to.equal(true);
      });
    });

    it("should respect contact form disabled flag", () => {
      const mockFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: false,
          message: "Contact form is temporarily unavailable",
        },
      };

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: mockFlags,
      }).as("getFlags");

      cy.visit("/");
      cy.wait("@getFlags");

      // Verify disabled state
      cy.window().then((win) => {
        const cached = win.localStorage.getItem("portfolio:feature-flags");
        const parsed = JSON.parse(cached!);
        expect(parsed.flags."email-contact-form".enabled).to.equal(false);
        expect(parsed.flags."email-contact-form".message).to.equal(
          "Contact form is temporarily unavailable",
        );
      });
    });
  });

  describe("Cache behavior", () => {
    it("should expire cache after TTL", () => {
      const oldTimestamp = Date.now() - 120000; // 2 minutes ago (expired)
      const cachedFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: true,
        },
      };

      cy.window().then((win) => {
        win.localStorage.setItem(
          "portfolio:feature-flags",
          JSON.stringify({
            flags: cachedFlags,
            timestamp: oldTimestamp,
          }),
        );
      });

      const newFlags: FeatureFlags = {
        "email-contact-form": {
          enabled: false,
        },
      };

      cy.intercept("GET", FEATURE_FLAGS_API_URL, {
        statusCode: 200,
        body: newFlags,
      }).as("getFlags");

      cy.visit("/");
      cy.wait("@getFlags");

      // Should fetch new flags due to expired cache
      cy.window().then((win) => {
        const cached = win.localStorage.getItem("portfolio:feature-flags");
        const parsed = JSON.parse(cached!);
        expect(parsed.flags."email-contact-form".enabled).to.equal(false);
      });
    });
  });

  describe("CORS and security", () => {
    it("should send correct headers when fetching flags", () => {
      cy.intercept("GET", FEATURE_FLAGS_API_URL, (req) => {
        expect(req.headers["accept"]).to.equal("application/json");
        req.reply({
          statusCode: 200,
          body: {
            "email-contact-form": {
              enabled: true,
            },
          },
        });
      }).as("getFlags");

      cy.visit("/");
      cy.wait("@getFlags");
    });
  });
});
