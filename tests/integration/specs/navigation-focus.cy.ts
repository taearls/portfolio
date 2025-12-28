/// <reference types="cypress" />

describe("Mobile Navigation Focus", () => {
  // Mobile viewport width where hamburger menu is shown
  const MOBILE_WIDTH = 375;
  const MOBILE_HEIGHT = 667;

  beforeEach(() => {
    cy.viewport(MOBILE_WIDTH, MOBILE_HEIGHT);
    cy.visit("/");
  });

  describe("Focus Management", () => {
    it("moves focus to first navigation link when mobile nav opens", () => {
      // Open the mobile navigation
      cy.findByRole("button", { name: /open navigation/i }).click();

      // Wait for focus to be applied (matches FOCUS_TRAP_INIT_DELAY_MS)
      cy.wait(100);

      // Assert that the first navigation link has focus
      cy.findByRole("link", { name: /visit home page/i }).should("have.focus");
    });

    it("applies visible focus styles to focused navigation link", () => {
      // Open the mobile navigation
      cy.findByRole("button", { name: /open navigation/i }).click();

      // Wait for focus to be applied
      cy.wait(100);

      // Get the first link and verify focus styles are applied
      cy.findByRole("link", { name: /visit home page/i })
        .should("have.focus")
        .then(($link) => {
          // Get computed styles to verify outline is applied
          const styles = window.getComputedStyle($link[0]);
          const outlineStyle = styles.getPropertyValue("outline-style");
          const outlineWidth = styles.getPropertyValue("outline-width");

          // Assert outline is visible (not "none" and has width)
          expect(outlineStyle).to.not.equal("none");
          expect(parseInt(outlineWidth)).to.be.greaterThan(0);
        });
    });

    it("uses the correct focus color (--active-color)", () => {
      // Open the mobile navigation
      cy.findByRole("button", { name: /open navigation/i }).click();

      // Wait for focus to be applied
      cy.wait(100);

      // Get the first link and verify the outline color
      cy.findByRole("link", { name: /visit home page/i })
        .should("have.focus")
        .then(($link) => {
          const styles = window.getComputedStyle($link[0]);
          const outlineColor = styles.getPropertyValue("outline-color");

          // The --active-color in light mode is rgb(0, 150, 175) - a cyan color
          // We check that it's a cyan-ish color (high green/blue, low red)
          // Note: Color values may vary slightly based on browser rendering
          expect(outlineColor).to.match(/rgb\(\d+,\s*\d+,\s*\d+\)/);

          // Parse RGB values
          const rgbMatch = outlineColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          if (rgbMatch) {
            const [, r, g, b] = rgbMatch.map(Number);
            // Cyan colors have low red, high green and blue
            // Light mode: rgb(0, 150, 175) or similar cyan
            expect(g + b).to.be.greaterThan(r * 2);
          }
        });
    });
  });

  describe("Focus Ring Visibility", () => {
    it("shows focus ring on all navigation links when focused", () => {
      // Open the mobile navigation
      cy.findByRole("button", { name: /open navigation/i }).click();

      // Wait for nav to open
      cy.wait(100);

      // Verify each navigation link shows focus ring when focused
      const navLinks = [
        /visit home page/i,
        /visit code page/i,
        /visit resume page/i,
        /visit contact page/i,
      ];

      navLinks.forEach((linkName) => {
        cy.findByRole("link", { name: linkName })
          .focus()
          .should("have.focus")
          .then(($link) => {
            const styles = window.getComputedStyle($link[0]);
            const outlineStyle = styles.getPropertyValue("outline-style");
            expect(outlineStyle).to.not.equal("none");
          });
      });
    });
  });
});
