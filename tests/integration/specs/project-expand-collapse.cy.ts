/// <reference types="cypress" />

/**
 * Integration tests for project card expand/collapse functionality.
 * Tests the global controls and individual card toggle behavior on the Code page.
 */
describe("Project Expand/Collapse", () => {
  beforeEach(() => {
    cy.visit("/code");
    // Ensure Projects tab is active (it's the default)
    cy.get('[role="tabpanel"]').should("be.visible");
  });

  describe("Global Controls", () => {
    it("should display Expand All and Collapse All buttons", () => {
      cy.contains("button", "Expand All").should("be.visible");
      cy.contains("button", "Collapse All").should("be.visible");
    });

    it("should have Expand All disabled when all projects are expanded", () => {
      // All projects expanded by default
      cy.contains("button", "Expand All").should("be.disabled");
      cy.contains("button", "Collapse All").should("not.be.disabled");
    });

    it("should collapse all projects when Collapse All is clicked", () => {
      cy.contains("button", "Collapse All").click();

      // All toggle buttons should show collapsed state
      cy.get('[aria-expanded="false"]').should("have.length.at.least", 1);

      // Expand All should now be enabled
      cy.contains("button", "Expand All").should("not.be.disabled");
      cy.contains("button", "Collapse All").should("be.disabled");
    });

    it("should expand all projects when Expand All is clicked", () => {
      // First collapse all
      cy.contains("button", "Collapse All").click();

      // Then expand all
      cy.contains("button", "Expand All").click();

      // All projects should be expanded
      cy.get('[aria-expanded="true"]').should("have.length.at.least", 1);

      // Expand All should be disabled again
      cy.contains("button", "Expand All").should("be.disabled");
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
      // Get the first project's collapsible content
      cy.get('[data-collapsed="false"]').first().as("content");

      // Find and click the toggle button
      cy.get('[aria-expanded="true"]').first().click();

      // Content should be collapsed
      cy.get('[data-collapsed="true"]').should("exist");
    });

    it("should show content when expanded", () => {
      // Collapse a project first
      cy.get('[aria-expanded="true"]').first().click();

      // Find the collapsed content
      cy.get('[data-collapsed="true"]').first().should("exist");

      // Expand it again
      cy.get('[aria-expanded="false"]').first().click();

      // Content should be visible
      cy.get('[data-collapsed="false"]').should("exist");
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

    it("should have accessible global control buttons", () => {
      cy.contains("button", "Expand All").should(
        "have.attr",
        "aria-label",
        "Expand all projects",
      );
      cy.contains("button", "Collapse All").should(
        "have.attr",
        "aria-label",
        "Collapse all projects",
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

      // Switch back to Projects tab
      cy.contains('[role="tab"]', "Projects").click();
      cy.get('[role="tabpanel"]:not([hidden])').should("exist");

      // First project should still be collapsed
      cy.get('[aria-expanded="false"]').should("have.length.at.least", 1);
    });
  });

  describe("Open Source Tab", () => {
    it("should have expand/collapse controls on Open Source tab", () => {
      // Click to switch to Open Source tab from Projects
      cy.contains('[role="tab"]', "Open Source").click();
      // Wait for content to load
      cy.contains("button", "Expand All").should("exist");
      cy.contains("button", "Collapse All").should("exist");
    });
  });
});
