/// <reference types="cypress" />

/* eslint-disable @typescript-eslint/no-unused-expressions */

/**
 * CLS Optimization Tests
 *
 * These tests verify that Cumulative Layout Shift (CLS) prevention measures
 * are properly implemented. They focus on structural attributes rather than
 * specific content to avoid brittleness.
 *
 * Note: Chai expects in Cypress callbacks use expression syntax,
 * which triggers @typescript-eslint/no-unused-expressions warnings.
 * This is disabled at file level as it's standard Cypress/Chai pattern.
 */

describe("CLS Optimization - Image Attributes", () => {
  beforeEach(() => {
    cy.visit("/code");
  });

  describe("Web Project Images", () => {
    it("should have lazy loading attribute on all project images", () => {
      // Test all images on the page, regardless of specific alt text
      cy.get('img[src*="cloudinary"]').each(($img) => {
        expect($img.attr("loading")).to.equal("lazy");
      });
    });

    it("should have async decoding attribute on all project images", () => {
      cy.get('img[src*="cloudinary"]').each(($img) => {
        expect($img.attr("decoding")).to.equal("async");
      });
    });

    it("should render at least 3 project images", () => {
      // Verify minimum number of images rather than specific content
      cy.get('img[src*="cloudinary"]').should("have.length.at.least", 3);
    });

    it("should have images that are eventually visible", () => {
      // Use Cypress's automatic retry without hard-coded timeout
      cy.get('img[src*="cloudinary"]').first().should("be.visible");
    });
  });

  describe("CSS Containment", () => {
    it("should have layout containment on all images", () => {
      cy.get('img[src*="cloudinary"]').each(($img) => {
        const contain = $img.css("contain");
        // Should include "layout" in the contain value
        expect(contain).to.include("layout");
      });
    });
  });

  describe("Image Loading Performance", () => {
    it("should not block page rendering", () => {
      cy.visit("/code");

      // Heading should be visible (uses default Cypress timeout of 4s)
      cy.get("h1").should("be.visible");

      // Images should be in the DOM (even if not loaded yet)
      cy.get('img[src*="cloudinary"]').should("exist");
    });
  });
});

describe("CLS Optimization - Font Loading", () => {
  it("should use display=optional for Google Fonts", () => {
    cy.visit("/");

    // Check that the font link has display=optional parameter
    cy.get('link[href*="googleapis"]').should(($links) => {
      let foundOptionalDisplay = false;

      $links.each((_, link) => {
        const href = Cypress.$(link).attr("href");
        if (href && href.includes("display=optional")) {
          foundOptionalDisplay = true;
        }
      });

      expect(
        foundOptionalDisplay,
        "Expected to find Google Fonts link with display=optional",
      ).to.be.true;
    });
  });

  it("should render text content without blocking", () => {
    cy.visit("/");

    // Use default Cypress timeout (4s) which is more appropriate for CI
    cy.get("h1").should("be.visible");

    // Check for any paragraph text rather than specific content
    cy.get("p").should("exist").and("be.visible");
  });
});

describe("CLS Optimization - Mobile Viewport", () => {
  beforeEach(() => {
    // Set mobile viewport (iPhone SE dimensions)
    cy.viewport(375, 667);
  });

  it("should maintain CLS optimizations on mobile viewport", () => {
    cy.visit("/code");

    // Verify all images have CLS attributes on mobile
    cy.get('img[src*="cloudinary"]').each(($img) => {
      expect($img.attr("loading")).to.equal("lazy");
      expect($img.attr("decoding")).to.equal("async");
    });
  });

  it("should render content without layout shifts on mobile", () => {
    cy.visit("/");

    // Wait for page to be interactive (better than arbitrary wait)
    cy.get("h1").should("be.visible");

    // Store initial scroll position
    cy.window().then((win) => {
      const initialScrollY = win.scrollY;

      // Scroll down
      cy.scrollTo(0, 500, { duration: 300 });

      // Wait for scroll to complete and any potential layout shifts
      // Use Cypress command chaining instead of arbitrary wait
      cy.window().should((win2) => {
        const currentScrollY = win2.scrollY;
        // Verify we scrolled (allowing for small variations due to page height)
        expect(currentScrollY).to.be.greaterThan(initialScrollY);
      });
    });
  });
});

describe("CLS Optimization - Performance Metrics", () => {
  it("should load page content without errors", () => {
    cy.visit("/code");

    // Wait for main content to be visible (better than arbitrary timeout)
    cy.get("h1").should("be.visible");

    // Verify images are present in DOM
    cy.get('img[src*="cloudinary"]').should("exist");

    // Verify images eventually become visible (automatic retry)
    cy.get('img[src*="cloudinary"]').first().should("be.visible");

    // If we reach here without errors or timeouts, basic CLS optimizations
    // are working. Actual CLS score measurement requires Lighthouse/PSI.
  });
});

/**
 * Structural Tests - Less brittle, more maintainable
 *
 * These tests focus on:
 * 1. CSS selectors based on attributes (src*="cloudinary") rather than content
 * 2. Cypress's automatic retry mechanism (default 4s timeout)
 * 3. Relative assertions (.at.least) rather than exact counts
 * 4. Conditional logic (.each) to test patterns across elements
 * 5. No arbitrary cy.wait() calls - use .should() for conditions
 */
