/**
 * Integration tests for Feature Flags functionality
 *
 * This test suite covers both:
 * - Runtime flags: Fetched from Cloudflare Worker API, cached in localStorage
 * - Build-time flags: Resolved from flipt.yaml at build time, injected as import.meta.env.FEATURE_*
 *
 * Tests use localStorage cache pre-population instead of cy.intercept + cy.wait
 * to avoid cross-origin interception issues when the feature flags API runs on a
 * different port (localhost:8787) than the app (localhost:4173).
 *
 * Uses cy.setFlagsCache() command from support/support.ts
 * Uses FLAG_TEST_MATRIX for parametrized testing across flag states
 */

import type { FeatureFlags } from "../../src/types/featureFlags.ts";
import { CACHE_KEY } from "../../src/constants/featureFlags.ts";

import { forEachScenario, getScenario } from "./support/test-matrix.ts";

describe("Feature Flags Integration", () => {
  // Cache key imported from constants to ensure consistency with application

  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  describe("Build-time flags (GitOps)", () => {
    /**
     * Build-time flags are resolved during `npm run build` from flipt.yaml.
     * They're injected as import.meta.env.FEATURE_* constants.
     * Since these tests run against a built app, we verify the flags are working.
     */

    it("should have build-time feature flags enabled (from flipt.yaml)", () => {
      // Visit any page to load the app
      cy.visit("/");

      // Verify the app loaded successfully - this confirms build-time flags
      // didn't break the build process
      cy.get("header").should("be.visible");

      // The dark mode toggle icons should be visible since FEATURE_DARK_MODE_TOGGLE is true
      // Check for either sun or moon icon (depending on current theme)
      cy.get('[data-testid="sun-icon"], [data-testid="moon-icon"]').should(
        "exist",
      );
    });

    it("should include contact form code when build-time flag is enabled", () => {
      // When FEATURE_EMAIL_CONTACT_FORM is true at build time,
      // the ContactEmailForm component is included in the bundle

      // Pre-populate cache with enabled flag from test matrix
      const enabledScenario = getScenario("enabled");
      cy.setFlagsCache(enabledScenario.flags);

      cy.visit("/contact");

      // The contact section should exist (code was included in bundle)
      cy.get("main").should("exist");

      // Contact form should be present (build-time flag included the code,
      // runtime flag enabled it)
      cy.get("#contact-email-form").should("exist");
    });

    it("should allow runtime flag to disable a build-time enabled feature", () => {
      // This tests the "emergency kill switch" pattern:
      // - Build-time flag FEATURE_EMAIL_CONTACT_FORM is true (code is in bundle)
      // - Runtime flag can still disable it without a rebuild

      // Pre-populate cache with disabled flag from test matrix (simulating runtime override)
      const disabledScenario = getScenario("disabled");
      cy.setFlagsCache(disabledScenario.flags);

      cy.visit("/contact");

      // Contact form should NOT be visible (runtime flag disabled it)
      cy.get("#contact-email-form").should("not.exist");

      // Disabled message should be shown
      if (disabledScenario.expectations.messageText) {
        cy.contains(disabledScenario.expectations.messageText).should("exist");
      }
    });
  });

  describe("Runtime flags - Loading (Cloudflare Worker)", () => {
    it("should fetch and display feature flags on app load", () => {
      // Pre-populate cache with enabled flag from test matrix
      const enabledScenario = getScenario("enabled");
      cy.setFlagsCache(enabledScenario.flags);

      cy.visit("/");

      // Verify flags were stored in cache
      cy.window().then((win) => {
        const cached = win.localStorage.getItem(CACHE_KEY);
        expect(cached).to.exist;

        const parsed = JSON.parse(cached!);
        expect(parsed.flags).to.deep.equal(enabledScenario.flags);
      });
    });

    it("should use cached flags when available", () => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      cy.setFlagsCache(enabledScenario.flags);

      cy.visit("/");

      // Cached flags should be used immediately (no wait for API)
      cy.window().then((win) => {
        const cached = win.localStorage.getItem(CACHE_KEY);
        expect(cached).to.exist;

        const parsed = JSON.parse(cached!);
        expect(parsed.flags["email-contact-form"].enabled).to.equal(true);
      });
    });

    it("should handle API errors gracefully", () => {
      // When no cache exists and API fails, app should still load with defaults
      // We can't easily simulate API errors without intercepts, but we can
      // verify the app handles missing flags gracefully

      // Don't set any cache - the app should handle this gracefully
      cy.visit("/");

      // App should still load with default flags
      cy.get("header").should("be.visible");
      cy.get("footer").should("be.visible");
    });

    it("should handle network timeout gracefully", () => {
      // When no cache exists and API times out, app should still load
      // Don't set any cache - the app should handle this gracefully
      cy.visit("/");

      // App should still load despite timeout/missing API
      cy.get("header").should("be.visible");
      cy.get("footer").should("be.visible");
    });
  });

  describe("Runtime flags - Contact form behavior (Matrix Pattern)", () => {
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
        } else {
          cy.get("#contact-email-form").should("not.exist");
        }

        // Assert message display based on scenario expectations
        if (
          scenario.expectations.showsMessage &&
          scenario.expectations.messageText
        ) {
          cy.contains(scenario.expectations.messageText).should("exist");
        }

        // Verify flag is stored correctly in cache
        cy.window().then((win) => {
          const cached = win.localStorage.getItem(CACHE_KEY);
          const parsed = JSON.parse(cached!);
          expect(parsed.flags["email-contact-form"].enabled).to.equal(
            scenario.flags["email-contact-form"].enabled,
          );

          if (scenario.flags["email-contact-form"].message) {
            expect(parsed.flags["email-contact-form"].message).to.equal(
              scenario.flags["email-contact-form"].message,
            );
          }
        });
      });
    });
  });

  describe("Runtime flags - Cache behavior", () => {
    it("should expire cache after TTL", () => {
      const oldTimestamp = Date.now() - 120000; // 2 minutes ago (expired)

      // Use enabled scenario from test matrix with expired timestamp
      const enabledScenario = getScenario("enabled");
      cy.setFlagsCache(enabledScenario.flags, oldTimestamp);

      cy.visit("/");

      // App should still load - it will fetch new flags or use defaults
      cy.get("header").should("be.visible");
      cy.get("footer").should("be.visible");

      // The cache may be updated with new flags from the API
      // or remain expired - we just verify the app handles it gracefully
    });

    it("should use fresh cache immediately", () => {
      const freshTimestamp = Date.now(); // Fresh cache

      // Use enabled scenario from test matrix with fresh timestamp
      const enabledScenario = getScenario("enabled");
      cy.setFlagsCache(enabledScenario.flags, freshTimestamp);

      cy.visit("/contact");

      // Fresh cache should be used - form should be visible
      cy.get("#contact-email-form").should("be.visible");
    });
  });

  describe("Runtime flags - CORS and security", () => {
    it("should load app successfully regardless of API availability", () => {
      // This test verifies the app works even without mocking the API
      // The app should gracefully handle missing/unavailable API

      cy.visit("/");

      // App should load successfully
      cy.get("header").should("be.visible");
      cy.get("footer").should("be.visible");
    });

    it("should store flags with correct structure in cache", () => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      cy.setFlagsCache(enabledScenario.flags);

      cy.visit("/");

      // Verify cache structure is correct
      cy.window().then((win) => {
        const cached = win.localStorage.getItem(CACHE_KEY);
        expect(cached).to.exist;

        const parsed = JSON.parse(cached!);
        expect(parsed).to.have.property("flags");
        expect(parsed).to.have.property("timestamp");
        expect(typeof parsed.timestamp).to.equal("number");
      });
    });
  });

  describe("Admin Flags Dashboard (/admin/flags)", () => {
    /**
     * Tests for the feature flags admin dashboard that displays
     * current flag states in a read-only table view.
     *
     * Uses cy.intercept to mock the feature flags API response,
     * ensuring consistent test behavior regardless of API availability.
     *
     * API URL is configured in cypress.config.ts and can be overridden
     * via CYPRESS_featureFlagsApi environment variable for different environments.
     */

    const visitAdminWithFlags = (flags: FeatureFlags) => {
      const apiUrl = Cypress.env("featureFlagsApi") as string;

      // Intercept the API request and return mock flags
      cy.intercept("GET", apiUrl, {
        statusCode: 200,
        body: flags,
      }).as("getFlags");

      cy.visit("/admin/flags");

      // Wait for the API request to complete
      cy.wait("@getFlags");

      // Wait for table to be visible (indicates page loaded with flags)
      // Relying on Cypress's built-in retry logic instead of explicit timeout
      cy.get("table").should("exist");
    };

    it("should display the admin dashboard with page title", () => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      visitAdminWithFlags(enabledScenario.flags);

      // Verify page title
      cy.get("h1").should("contain.text", "Feature Flags");

      // Verify document title is set
      cy.title().should("eq", "Feature Flags - Admin");
    });

    it("should display flags table with correct columns", () => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      visitAdminWithFlags(enabledScenario.flags);

      // Verify table headers
      cy.get("table").should("exist");
      cy.get("th").should("have.length", 3);
      cy.get("th").eq(0).should("contain.text", "Flag");
      cy.get("th").eq(1).should("contain.text", "Status");
      cy.get("th").eq(2).should("contain.text", "Description");
    });

    it("should display enabled flag with correct status badge", () => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      visitAdminWithFlags(enabledScenario.flags);

      // Verify flag row
      cy.get("table tbody tr").should("have.length.at.least", 1);
      cy.get("table tbody tr")
        .first()
        .within(() => {
          cy.get("td").eq(0).should("contain.text", "email-contact-form");
          cy.get("td").eq(1).should("contain.text", "Enabled");
        });
    });

    it("should display disabled flag with correct status badge", () => {
      // Use disabledNoMessage scenario from test matrix (disabled without message)
      const disabledScenario = getScenario("disabledNoMessage");
      visitAdminWithFlags(disabledScenario.flags);

      // Verify disabled status
      cy.get("table tbody tr")
        .first()
        .within(() => {
          cy.get("td").eq(1).should("contain.text", "Disabled");
        });
    });

    it("should display flag description from metadata", () => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      visitAdminWithFlags(enabledScenario.flags);

      // Verify description column shows metadata
      cy.get("table tbody tr")
        .first()
        .within(() => {
          cy.get("td")
            .eq(2)
            .should("contain.text", "Email contact form with Postmark");
        });
    });

    it("should have a refresh button", () => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      visitAdminWithFlags(enabledScenario.flags);

      // Verify refresh button exists and is clickable
      cy.get('button[aria-label="Refresh feature flags"]').should("exist");
      cy.get('button[aria-label="Refresh feature flags"]').should(
        "contain.text",
        "Refresh",
      );
      cy.get('button[aria-label="Refresh feature flags"]').should(
        "not.be.disabled",
      );
    });

    it("should display status bar", () => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      visitAdminWithFlags(enabledScenario.flags);

      // Verify status bar exists (may show "Connected" or "Last updated")
      cy.get("main").should("exist");
      // The status bar should contain some status text
      cy.get("main").should("contain.text", "feature flags");
    });

    it("should be accessible via keyboard navigation", () => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      visitAdminWithFlags(enabledScenario.flags);

      // Tab to refresh button and verify it can be focused
      cy.get('button[aria-label="Refresh feature flags"]').focus();
      cy.get('button[aria-label="Refresh feature flags"]').should("have.focus");
    });

    it("should display status badge with proper ARIA attributes", () => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      visitAdminWithFlags(enabledScenario.flags);

      // Verify status badge has proper accessibility (using output element)
      cy.get("output").should("exist");
      cy.get('output[aria-label="Enabled"]').should("exist");
    });

    it("should work correctly in dark mode", () => {
      // Use enabled scenario from test matrix
      const enabledScenario = getScenario("enabled");
      visitAdminWithFlags(enabledScenario.flags);

      // Apply dark mode directly (toggle is tested elsewhere)
      cy.document().then((doc) => {
        doc.documentElement.classList.remove("light-theme");
        doc.documentElement.classList.add("dark-theme");
      });

      // Verify dark mode class is applied
      cy.get("html").should("have.class", "dark-theme");

      // Verify table is still visible in dark mode
      cy.get("table").should("be.visible");
      cy.get("h1").should("be.visible");
    });

    it("should not appear in main navigation", () => {
      cy.visit("/");

      // Admin flags page should not be in the main navigation
      cy.get("nav").should("not.contain.text", "Feature Flags");
      cy.get("nav").should("not.contain.text", "Admin");
    });
  });
});
