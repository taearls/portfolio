/// <reference types="cypress" />

/**
 * Integration tests for project card expand/collapse functionality.
 * Tests the global controls and individual card toggle behavior on the Code page.
 */
describe("Project Expand/Collapse", () => {
  beforeEach(() => {
    cy.visit("/code");
    // Wait for the visible Collapse All button (indicates page is fully loaded)
    cy.get('[aria-label="Collapse all projects"]:visible').should("exist");
  });

  describe("Global Controls", () => {
    it("should display Collapse All button when projects are expanded (default)", () => {
      // All projects expanded by default, so Collapse All should be shown
      cy.get('[aria-label="Collapse all projects"]:visible').should("exist");
      cy.get('[aria-label="Expand all projects"]:visible').should("not.exist");
    });

    it("should switch to Expand All button when all projects are collapsed", () => {
      // Click the visible Collapse All button
      cy.get('[aria-label="Collapse all projects"]:visible').click();

      // Button should switch to Expand All
      cy.get('[aria-label="Expand all projects"]:visible').should("exist");
      cy.get('[aria-label="Collapse all projects"]:visible').should(
        "not.exist",
      );
    });

    it("should switch to Collapse All button when Expand All is clicked", () => {
      // First collapse all
      cy.get('[aria-label="Collapse all projects"]:visible').click();

      // Then expand all
      cy.get('[aria-label="Expand all projects"]:visible').click();

      // All projects should be expanded
      cy.get('[aria-expanded="true"]:visible').should(
        "have.length.at.least",
        1,
      );

      // Button should switch back to Collapse All
      cy.get('[aria-label="Collapse all projects"]:visible').should("exist");
      cy.get('[aria-label="Expand all projects"]:visible').should("not.exist");
    });
  });

  describe("Individual Toggle", () => {
    it("should toggle individual project when chevron is clicked", () => {
      // Find first project toggle button and verify initial state
      cy.get('[aria-expanded="true"]')
        .first()
        .should("have.attr", "aria-expanded", "true")
        .click();

      // Verify it collapsed
      cy.get("[aria-expanded]")
        .first()
        .should("have.attr", "aria-expanded", "false");

      // Click to expand again
      cy.get("[aria-expanded]").first().click();
      cy.get("[aria-expanded]")
        .first()
        .should("have.attr", "aria-expanded", "true");
    });

    it("should hide content when collapsed", () => {
      // Get first toggle button and its controlled content
      cy.get('[aria-expanded="true"]').first().as("toggle");

      cy.get("@toggle")
        .invoke("attr", "aria-controls")
        .then((contentId) => {
          expect(contentId, "aria-controls").to.be.a("string").and.not.be.empty;
          cy.get("@toggle").click();
          // Assert on the specific content element controlled by this toggle
          cy.get(`#${contentId}`).should("have.attr", "data-collapsed", "true");
        });
    });

    it("should show content when expanded", () => {
      // Collapse a project first
      cy.get('[aria-expanded="true"]').first().click();

      // Get the collapsed toggle and its controlled content
      cy.get('[aria-expanded="false"]').first().as("toggle");

      cy.get("@toggle")
        .invoke("attr", "aria-controls")
        .then((contentId) => {
          expect(contentId, "aria-controls").to.be.a("string").and.not.be.empty;
          cy.get("@toggle").click();
          // Assert on the specific content element controlled by this toggle
          cy.get(`#${contentId}`).should("have.attr", "data-collapsed", "false");
        });
    });
  });

  describe("Accessibility", () => {
    it("should have aria-controls attribute linking to content", () => {
      cy.get("[aria-expanded]").first().should("have.attr", "aria-controls");
    });

    it("should have descriptive aria-label on toggle buttons", () => {
      cy.get("[aria-expanded]")
        .first()
        .should("have.attr", "aria-label")
        .and("match", /(Expand|Collapse)/);
    });

    it("toggle button should be a native button element", () => {
      // Toggle buttons should be proper button elements for accessibility
      cy.get("[aria-expanded]")
        .first()
        .should("have.prop", "tagName", "BUTTON");
    });

    it("should have accessible global control button", () => {
      // Initially shows Collapse All
      cy.contains("button", "Collapse All").should(
        "have.attr",
        "aria-label",
        "Collapse all projects",
      );

      // After collapsing, should show Expand All with proper label
      cy.contains("button", "Collapse All").click();
      cy.contains("button", "Expand All").should(
        "have.attr",
        "aria-label",
        "Expand all projects",
      );
    });
  });

  describe("State Persistence within Session", () => {
    it("should maintain expanded state when switching tabs and back", () => {
      // Collapse first project
      cy.get('[aria-expanded="true"]').first().click();
      cy.get('[aria-expanded="false"]').should("have.length.at.least", 1);

      // Switch to Open Source tab
      cy.contains('[role="tab"]', "Open Source").click();
      cy.get('[role="tabpanel"]:not([hidden])').should("exist");

      // Switch back to Personal Projects tab
      cy.contains('[role="tab"]', "Personal Projects").click();
      cy.get('[role="tabpanel"]:not([hidden])').should("exist");

      // First project should still be collapsed
      cy.get('[aria-expanded="false"]').should("have.length.at.least", 1);
    });
  });

  describe("Open Source Tab", () => {
    it("should have expand/collapse control on Open Source tab", () => {
      // Click to switch to Open Source tab from Projects
      cy.contains('[role="tab"]', "Open Source").click();
      // Wait for content to load - should show Collapse All since items are expanded by default
      cy.contains("button", "Collapse All").should("exist");
    });
  });

  describe("Results Count Display", () => {
    it("should show 'Showing X projects' when all projects are expanded", () => {
      // All projects are expanded by default
      // Count all visible project toggle buttons to determine total
      cy.get('[aria-expanded="true"]:visible').then(($buttons) => {
        const count = $buttons.length;
        const label = count === 1 ? "project" : "projects";
        cy.contains(`Showing ${count} ${label}`).should("exist");
      });
    });

    it("should show 'Showing X of Y projects' when some projects are collapsed", () => {
      // Get initial total count
      cy.get('[aria-expanded="true"]:visible').then(($buttons) => {
        const total = $buttons.length;

        // Collapse the first project
        cy.get('[aria-expanded="true"]:visible').first().click();

        // Should now show "X of Y" format
        const expanded = total - 1;
        const label = total === 1 ? "project" : "projects";
        cy.contains(`Showing ${expanded} of ${total} ${label}`).should("exist");
      });
    });

    it("should update count when individual projects are toggled", () => {
      // Get initial total
      cy.get('[aria-expanded="true"]:visible').then(($buttons) => {
        const total = $buttons.length;
        const label = total === 1 ? "project" : "projects";

        // Verify initial state shows all expanded
        cy.contains(`Showing ${total} ${label}`).should("exist");

        // Collapse first project
        cy.get('[aria-expanded="true"]:visible').first().click();
        cy.contains(`Showing ${total - 1} of ${total} ${label}`).should(
          "exist",
        );

        // Collapse second project
        cy.get('[aria-expanded="true"]:visible').first().click();
        cy.contains(`Showing ${total - 2} of ${total} ${label}`).should(
          "exist",
        );

        // Expand one back
        cy.get('[aria-expanded="false"]:visible').first().click();
        cy.contains(`Showing ${total - 1} of ${total} ${label}`).should(
          "exist",
        );
      });
    });

    it("should show 'Showing 0 of X projects' when all projects are collapsed", () => {
      // Get total count first
      cy.get('[aria-expanded="true"]:visible').then(($buttons) => {
        const total = $buttons.length;
        const label = total === 1 ? "project" : "projects";

        // Click Collapse All
        cy.get('[aria-label="Collapse all projects"]:visible').click();

        // Should show 0 of total
        cy.contains(`Showing 0 of ${total} ${label}`).should("exist");
      });
    });

    it("should return to 'Showing X projects' when Expand All is clicked", () => {
      // Get total count
      cy.get('[aria-expanded="true"]:visible').then(($buttons) => {
        const total = $buttons.length;
        const label = total === 1 ? "project" : "projects";

        // Collapse all first
        cy.get('[aria-label="Collapse all projects"]:visible').click();
        cy.contains(`Showing 0 of ${total} ${label}`).should("exist");

        // Expand all
        cy.get('[aria-label="Expand all projects"]:visible').click();

        // Should show full count without "of X" format
        cy.contains(`Showing ${total} ${label}`).should("exist");
        // Verify "of" is NOT present (all are expanded)
        cy.contains(`of ${total}`).should("not.exist");
      });
    });

    it("should update count when search filter reduces visible projects", () => {
      // Get initial count of all projects
      cy.get('[aria-expanded="true"]:visible').then(($allButtons) => {
        const totalCount = $allButtons.length;

        // Type in the search to filter (use a project name that exists)
        cy.get('input[type="text"]').first().type("Cuckoo");

        // Wait for filter to apply - should have fewer projects
        cy.get('[aria-expanded="true"]:visible').should(
          "have.length.lessThan",
          totalCount,
        );

        // Verify the count matches the filtered results
        cy.get('[aria-expanded="true"]:visible').then(($filteredButtons) => {
          const filteredCount = $filteredButtons.length;
          const label = filteredCount === 1 ? "project" : "projects";
          cy.contains(`Showing ${filteredCount} ${label}`).should("exist");
        });
      });
    });

    it("should work correctly on Open Source tab", () => {
      // Switch to Open Source tab
      cy.contains('[role="tab"]', "Open Source").click();

      // Wait for tab content to load
      cy.get('[aria-label="Collapse all projects"]:visible').should("exist");

      // Get contribution count
      cy.get('[aria-expanded="true"]:visible').then(($buttons) => {
        const total = $buttons.length;
        const label = total === 1 ? "project" : "projects";

        // Verify count is shown
        cy.contains(`Showing ${total} ${label}`).should("exist");

        // Collapse one
        cy.get('[aria-expanded="true"]:visible').first().click();

        // Verify partial count shown
        cy.contains(`Showing ${total - 1} of ${total} ${label}`).should(
          "exist",
        );
      });
    });
  });
});
