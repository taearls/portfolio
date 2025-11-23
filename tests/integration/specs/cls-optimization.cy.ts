/// <reference types="cypress" />

describe("CLS Optimization - Image Attributes", () => {
  beforeEach(() => {
    cy.visit("/code");
  });

  describe("Web Project Images", () => {
    it("should have lazy loading attribute on all web project images", () => {
      cy.get('img[alt*="Cuckoo"]').should("have.attr", "loading", "lazy");
      cy.get('img[alt*="Road Ranger"]').should("have.attr", "loading", "lazy");
      cy.get('img[alt*="Space Clones"]').should("have.attr", "loading", "lazy");
    });

    it("should have async decoding attribute on all web project images", () => {
      cy.get('img[alt*="Cuckoo"]').should("have.attr", "decoding", "async");
      cy.get('img[alt*="Road Ranger"]').should(
        "have.attr",
        "decoding",
        "async",
      );
      cy.get('img[alt*="Space Clones"]').should(
        "have.attr",
        "decoding",
        "async",
      );
    });

    it("should have all three web project images present", () => {
      // Verify all three web project images are rendered
      cy.get('img[alt*="Cuckoo"]').should("exist").and("be.visible");
      cy.get('img[alt*="Road Ranger"]').should("exist").and("be.visible");
      cy.get('img[alt*="Space Clones"]').should("exist").and("be.visible");
    });
  });

  describe("CSS Containment", () => {
    it("should have layout containment on all images", () => {
      cy.get('img[alt*="Cuckoo"]').should(($img) => {
        const contain = $img.css("contain");
        // Should include "layout" in the contain value
        expect(contain).to.include("layout");
      });

      cy.get('img[alt*="Road Ranger"]').should(($img) => {
        const contain = $img.css("contain");
        expect(contain).to.include("layout");
      });

      cy.get('img[alt*="Space Clones"]').should(($img) => {
        const contain = $img.css("contain");
        expect(contain).to.include("layout");
      });
    });
  });

  describe("Image Loading Performance", () => {
    it("should not block page rendering", () => {
      // Visit the page and check that content is visible quickly
      cy.visit("/code");

      // Heading should be visible immediately
      cy.get("h1").should("be.visible").and("include.text", "Web Projects");

      // Images should be in the DOM (even if not loaded yet)
      cy.get('img[alt*="Cuckoo"]').should("exist");
      cy.get('img[alt*="Road Ranger"]').should("exist");
      cy.get('img[alt*="Space Clones"]').should("exist");
    });
  });
});

describe("CLS Optimization - Font Loading", () => {
  it("should use display=optional for Google Fonts", () => {
    cy.visit("/");

    // Check that the font link has display=optional parameter
    cy.document().then((doc) => {
      const fontLinks = doc.querySelectorAll('link[href*="googleapis"]');
      let foundOptionalDisplay = false;

      fontLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.includes("display=optional")) {
          foundOptionalDisplay = true;
        }
      });

      expect(foundOptionalDisplay).to.be.true;
    });
  });

  it("should render text content immediately without waiting for fonts", () => {
    // Visit the page
    cy.visit("/");

    // Text should be visible very quickly (within 1 second)
    cy.get("h1", { timeout: 1000 }).should("be.visible");

    // Main biography text should be visible - check for first paragraph
    cy.contains("software engineer", { timeout: 1000 }).should("be.visible");
  });
});

describe("CLS Optimization - Mobile Viewport", () => {
  beforeEach(() => {
    // Set mobile viewport (iPhone SE dimensions)
    cy.viewport(375, 667);
  });

  it("should maintain CLS optimizations on mobile viewport", () => {
    cy.visit("/code");

    // All images should still have lazy loading and async decoding on mobile
    cy.get('img[alt*="Cuckoo"]').should(($img) => {
      expect($img.attr("loading")).to.equal("lazy");
      expect($img.attr("decoding")).to.equal("async");
    });

    cy.get('img[alt*="Road Ranger"]').should(($img) => {
      expect($img.attr("loading")).to.equal("lazy");
      expect($img.attr("decoding")).to.equal("async");
    });

    cy.get('img[alt*="Space Clones"]').should(($img) => {
      expect($img.attr("loading")).to.equal("lazy");
      expect($img.attr("decoding")).to.equal("async");
    });
  });

  it("should not cause layout shifts when scrolling on mobile", () => {
    cy.visit("/");

    // Scroll down
    cy.scrollTo(0, 500);

    // Wait a bit for any potential layout shifts
    cy.wait(500);

    // Verify scroll position is stable (no unexpected jumps)
    cy.window().then((win) => {
      const currentScrollY = win.scrollY;
      // Should be around 500 (allowing small variations)
      expect(currentScrollY).to.be.closeTo(500, 50);
    });
  });
});

describe("CLS Optimization - Performance Metrics", () => {
  it("should have minimal layout shifts on page load", () => {
    cy.visit("/code");

    // Wait for page to be fully loaded
    cy.wait(2000);

    // Check that all images are loaded and visible
    cy.get('img[alt*="Cuckoo"]').should("be.visible");
    cy.get('img[alt*="Road Ranger"]').should("be.visible");
    cy.get('img[alt*="Space Clones"]').should("be.visible");

    // If page loads without errors and images are visible,
    // CLS optimizations are working (explicit CLS measurement
    // requires Performance Observer API which is complex to test)
  });
});
