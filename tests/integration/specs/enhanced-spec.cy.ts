/// <reference types="cypress" />

describe("Enhanced Integration Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Navigation Flow", () => {
    it("will navigate between all pages", () => {
      // Home page
      cy.get("h1").should("include.text", "Hi there!");

      // Navigate to projects
      cy.get("a").contains("Code").click();
      cy.url().should("include", "/code");
      cy.get("h1").should("include.text", "Web Projects");

      // Navigate to contact
      cy.get("a").contains("Contact").click();
      cy.url().should("include", "/contact");
      cy.get("h1").should("include.text", "Contact");

      // Navigate back to home
      cy.get("a").contains("Home").click();
      cy.url().should("eq", Cypress.config("baseUrl") + "/");
    });

    it("will handle 404 page correctly", () => {
      cy.visit("/nonexistent-page");
      cy.get("h1").should("include.text", "Oh no!");
      cy.get("[data-testid='does-not-exist']").should("be.visible");

      // Test return button
      cy.get("button").contains("Return to Previous Page").click();
      cy.go("back");
    });
  });

  describe("Theme Switching", () => {
    it("will toggle between light and dark themes", () => {
      // Check initial theme (should be light by default)
      cy.get("html").should("have.class", "light-theme");

      // Find and click the theme toggle
      cy.get("[data-testid='sun-icon']").should("be.visible");
      cy.get("[data-testid='sun-icon']").click();

      // Should switch to dark theme
      cy.get("html").should("have.class", "dark-theme");
      cy.get("[data-testid='moon-icon']").should("be.visible");

      // Toggle back to light
      cy.get("[data-testid='moon-icon']").click();
      cy.get("html").should("have.class", "light-theme");
    });
  });

  describe("Responsive Behavior", () => {
    it("will show mobile navigation on small screens", () => {
      cy.viewport(375, 667); // Mobile viewport
      cy.visit("/");

      // Navigation should be hidden initially on mobile
      cy.get("nav").should("be.visible");
      cy.get("[role='menu']").should("have.class", "hidden");

      // Toggle navigation
      cy.get("button").should("be.visible");
      cy.get("button[aria-label*='Navigation']").click();
      cy.get("[role='menu']").should("not.have.class", "hidden");
    });

    it("will show desktop navigation on large screens", () => {
      cy.viewport(1024, 768); // Desktop viewport
      cy.visit("/");

      // Navigation should be visible on desktop
      cy.get("[role='menu']").should("not.have.class", "hidden");
    });
  });

  describe("Accessibility", () => {
    it("will have proper ARIA labels", () => {
      cy.get("a").each(($link) => {
        const href = $link.attr("href");
        if (href && href.startsWith("http")) {
          // External links should have aria-label
          cy.wrap($link).should("have.attr", "aria-label");
        }
      });
    });

    it("will have proper heading structure", () => {
      cy.get("h1").should("have.length.at.least", 1);
      cy.get("h2").should("have.length.at.least", 1);
    });

    it("will have proper button labels", () => {
      cy.get("button").each(($button) => {
        // Buttons should have accessible text or aria-label
        const text = $button.text();
        const ariaLabel = $button.attr("aria-label");
        cy.wrap(text || ariaLabel).should("exist");
      });
    });
  });

  describe("External Links", () => {
    it("will open external links in new tabs", () => {
      cy.get("a[href^='http']").each(($link) => {
        cy.wrap($link).should("have.attr", "target", "_blank");
        cy.wrap($link).should("have.attr", "rel", "noopener noreferrer");
      });
    });
  });

  describe("Form Interactions", () => {
    it("will handle contact form correctly", () => {
      cy.visit("/contact");

      // Check if email link is present
      cy.get("a[href^='mailto:']").should("be.visible");
      cy.get("a[href^='mailto:']").should(
        "contain.text",
        "tyler.a.earls@gmail.com",
      );
    });
  });

  describe("Performance", () => {
    it("will load pages within reasonable time", () => {
      cy.visit("/", { timeout: 10000 });
      cy.get("main").should("be.visible");

      cy.visit("/code", { timeout: 10000 });
      cy.get("main").should("be.visible");

      cy.visit("/contact", { timeout: 10000 });
      cy.get("main").should("be.visible");
    });
  });

  describe("SEO and Meta", () => {
    it("will have proper page titles", () => {
      cy.visit("/");
      cy.title().should("not.be.empty");

      cy.visit("/code");
      cy.title().should("not.be.empty");

      cy.visit("/contact");
      cy.title().should("not.be.empty");
    });
  });
});
