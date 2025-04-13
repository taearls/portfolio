/// <reference types="cypress" />

describe("Page Render Smoke Tests", () => {
  it("renders the Home Page", () => {
    cy.visit("/");

    cy.get("h1").should("include.text", "Hi there!");
  });
  it("renders the Code Page", () => {
    cy.visit("/code");

    cy.get("h1").should("include.text", "Web Projects");
  });
  it("renders the Contact Page", () => {
    cy.visit("/contact");

    cy.get("h1").should("include.text", "Contact");
  });
  it("renders the 404 Page", () => {
    const url = "/some-random-string";
    cy.visit(url);

    const baseUrlWithoutProtocol = Cypress.config("baseUrl").split("://")[1];
    const fullUrl = baseUrlWithoutProtocol + url;

    cy.findByTestId("does-not-exist").should(
      "have.text",
      `${fullUrl} does not exist.`,
    );
  });
});
