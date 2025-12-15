// https://github.com/testing-library/cypress-testing-library
import "@testing-library/cypress/add-commands";

/**
 * Custom Cypress commands for Turnstile integration testing
 *
 * In CI, Cloudflare's Turnstile CDN may not load properly in headless browsers.
 * We stub the Turnstile API script to provide a mock implementation that
 * auto-succeeds with a test token.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Stub the Turnstile API to bypass CDN loading in CI
       */
      stubTurnstile(): Chainable<void>;

      /**
       * Wait for Turnstile to complete (either real or stubbed)
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

/**
 * Mock Turnstile implementation that auto-succeeds
 * Used to bypass CDN loading issues in CI environments
 */
const createTurnstileMock = () => ({
  render: function (
    container: string | HTMLElement,
    options?: { callback?: (token: string) => void },
  ) {
    // Create a fake widget div
    const widget = document.createElement("div");
    widget.id = "turnstile-widget-mock";
    widget.innerHTML =
      '<div style="padding: 10px; background: #f0f0f0; text-align: center;">Turnstile Mock (Auto-pass)</div>';

    // Also create a fake iframe for tests that look for it
    const iframe = document.createElement("iframe");
    iframe.src = "about:blank#turnstile-mock";
    iframe.style.display = "none";
    widget.appendChild(iframe);

    const containerEl =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    if (containerEl) {
      containerEl.appendChild(widget);
    }

    // Auto-succeed after a short delay
    setTimeout(function () {
      if (options && options.callback) {
        options.callback("mock-turnstile-token-for-testing");
      }
    }, 100);

    return "mock-widget-id";
  },
  reset: function () {
    // No-op for mock
  },
  remove: function () {
    const widget = document.getElementById("turnstile-widget-mock");
    if (widget) widget.remove();
  },
  getResponse: function () {
    return "mock-turnstile-token-for-testing";
  },
});

// Store the mock for use in onBeforeLoad
let turnstileMockSetup = false;

Cypress.Commands.add("stubTurnstile", () => {
  // Flag that we should set up the mock on next visit
  turnstileMockSetup = true;

  // Intercept the script request to prevent real Turnstile from overwriting our mock
  cy.intercept("GET", "**/turnstile/v0/api.js*", {
    statusCode: 200,
    headers: { "content-type": "application/javascript" },
    body: "// Turnstile script blocked - using mock from onBeforeLoad",
  }).as("turnstileScript");
});

// Override cy.visit to inject Turnstile mock when stubTurnstile was called
Cypress.Commands.overwrite(
  "visit",
  (
    originalFn: Cypress.CommandOriginalFn<"visit">,
    url: string,
    options?: Partial<Cypress.VisitOptions>,
  ) => {
    if (turnstileMockSetup) {
      turnstileMockSetup = false; // Reset flag
      const mergedOptions: Partial<Cypress.VisitOptions> = {
        ...options,
        onBeforeLoad: (win) => {
          // Store callback for reset functionality
          let lastCallback: ((token: string) => void) | undefined;

          // Inject the Turnstile mock before page scripts run
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (win as any).turnstile = {
            render: function (
              container: string | HTMLElement,
              opts?: { callback?: (token: string) => void },
            ) {
              lastCallback = opts?.callback;

              const widget = document.createElement("div");
              widget.id = "turnstile-widget-mock";
              widget.innerHTML =
                '<div style="padding: 10px; background: #f0f0f0; text-align: center;">Turnstile Mock</div>';

              const iframe = document.createElement("iframe");
              iframe.src = "about:blank#turnstile-mock";
              iframe.style.display = "none";
              widget.appendChild(iframe);

              const containerEl =
                typeof container === "string"
                  ? win.document.querySelector(container)
                  : container;
              if (containerEl) {
                containerEl.appendChild(widget);
              }

              setTimeout(function () {
                if (opts && opts.callback) {
                  opts.callback("mock-turnstile-token-for-testing");
                }
              }, 100);

              return "mock-widget-id";
            },
            reset: function () {
              // When reset is called, trigger a new token after a short delay
              setTimeout(function () {
                if (lastCallback) {
                  lastCallback("mock-turnstile-token-for-testing-reset");
                }
              }, 100);
            },
            remove: function () {
              const widget = win.document.getElementById(
                "turnstile-widget-mock",
              );
              if (widget) widget.remove();
            },
            getResponse: function () {
              return "mock-turnstile-token-for-testing";
            },
          };

          // Call original onBeforeLoad if provided
          if (options?.onBeforeLoad) {
            options.onBeforeLoad(win);
          }
        },
      };
      return originalFn(url, mergedOptions);
    }
    return originalFn(url, options);
  },
);

Cypress.Commands.add("waitForTurnstile", () => {
  // Wait for the submit button to become enabled (indicates token received)
  // This works with both real Turnstile and our mock
  cy.get('button[type="submit"]', { timeout: 15000 }).should("not.be.disabled");
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
