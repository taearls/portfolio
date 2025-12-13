// https://github.com/testing-library/cypress-testing-library
import "@testing-library/cypress/add-commands";

/**
 * Custom Cypress commands for Turnstile integration testing
 *
 * In development, Cloudflare Turnstile uses test keys that auto-pass:
 * - 1x00000000000000000000AA = Always Pass (generates valid token automatically)
 * - 2x00000000000000000000AB = Always Block
 *
 * With the "Always Pass" key, the widget auto-completes and triggers onSuccess.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Wait for Turnstile widget to render and auto-generate a token.
       * Uses Cloudflare's test key which auto-passes in development.
       */
      waitForTurnstile(): Chainable<void>;

      /**
       * Fill the contact form with provided data
       */
      fillContactForm(data: {
        name: string;
        email: string;
        message: string;
      }): Chainable<void>;

      /**
       * Wait for form to be submittable (all fields valid + Turnstile passed)
       */
      waitForFormReady(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("waitForTurnstile", () => {
  // Wait for the Turnstile iframe to appear
  cy.get('iframe[src*="turnstile"]', { timeout: 10000 }).should("exist");

  // With test keys, the widget auto-passes after rendering
  // Wait for the submit button to become enabled (indicates token received)
  cy.get('button[type="submit"]', { timeout: 10000 }).should("not.be.disabled");
});

Cypress.Commands.add(
  "fillContactForm",
  (data: { name: string; email: string; message: string }) => {
    cy.get("#contactName").clear().type(data.name);
    cy.get("#contactEmail").clear().type(data.email);
    cy.get("#contactMessage").clear().type(data.message);
  },
);

Cypress.Commands.add("waitForFormReady", () => {
  // Wait for Turnstile and ensure button is enabled
  cy.waitForTurnstile();
  cy.get('button[type="submit"]').should("not.be.disabled");
});
