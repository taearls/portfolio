/**
 * Test Matrix for Feature Flags Integration Tests
 *
 * This module provides a centralized test matrix constant that defines
 * all feature flag configurations and their expected outcomes. Tests
 * use this matrix to ensure comprehensive coverage across different
 * flag states.
 *
 * ## Architecture
 *
 * Implements the parametrized test matrix pattern for:
 * - contact-form.cy.ts - Form display and submission tests
 * - feature-flags.cy.ts - Flag behavior and admin dashboard tests
 *
 * ## Adding a New Flag State
 *
 * 1. Add a new entry to FLAG_TEST_MATRIX with:
 *    - `id`: Unique string identifier (e.g., "enabledWithWarning")
 *    - `description`: Human-readable test name shown in output
 *    - `flags`: FeatureFlags configuration object
 *    - `expectations`: Expected UI outcomes for assertions
 *
 * 2. Run tests - new scenario automatically included in all parametrized tests
 *
 * @example Adding a new scenario
 * ```typescript
 * {
 *   id: "enabledWithMaintenance",
 *   description: "Feature enabled but showing maintenance notice",
 *   flags: {
 *     "email-contact-form": {
 *       enabled: true,
 *       message: "Scheduled maintenance at midnight",
 *     },
 *   },
 *   expectations: {
 *     formVisible: true,
 *     showsMessage: true,
 *     messageText: "Scheduled maintenance at midnight",
 *   },
 * }
 * ```
 *
 * @see CLAUDE.md for testing guidelines and unit vs integration test boundaries
 */

import type { FeatureFlags } from "../../../src/types/featureFlags.ts";

/**
 * Test scenario for a specific flag configuration
 */
export interface FlagTestScenario {
  /** Unique identifier for the test scenario */
  id: string;
  /** Human-readable description of the scenario */
  description: string;
  /** Feature flag configuration for this scenario */
  flags: FeatureFlags;
  /** Expected outcomes for assertions */
  expectations: {
    /** Whether the contact form should be visible */
    formVisible: boolean;
    /** Whether a disabled message should be displayed */
    showsMessage: boolean;
    /** The expected disabled message text (if showsMessage is true) */
    messageText?: string;
  };
}

/**
 * Centralized test matrix defining all flag states and expected outcomes
 *
 * This constant serves as the single source of truth for flag test scenarios.
 * Each scenario defines:
 * - Flag configuration
 * - Expected UI state (form visibility, messages)
 * - Test case identifier and description
 */
export const FLAG_TEST_MATRIX: Array<FlagTestScenario> = [
  {
    id: "enabled",
    description: "Feature flag enabled - form visible and functional",
    flags: {
      "email-contact-form": {
        enabled: true,
      },
    },
    expectations: {
      formVisible: true,
      showsMessage: false,
    },
  },
  {
    id: "disabled",
    description: "Feature flag disabled with custom message",
    flags: {
      "email-contact-form": {
        enabled: false,
        message:
          "Contact form is temporarily unavailable. Please try again later.",
      },
    },
    expectations: {
      formVisible: false,
      showsMessage: true,
      messageText:
        "Contact form is temporarily unavailable. Please try again later.",
    },
  },
  {
    id: "disabledNoMessage",
    description: "Feature flag disabled without custom message",
    flags: {
      "email-contact-form": {
        enabled: false,
      },
    },
    expectations: {
      formVisible: false,
      showsMessage: false,
    },
  },
];

/**
 * Get a specific test scenario by ID
 */
export function getScenario(id: string): FlagTestScenario {
  const scenario = FLAG_TEST_MATRIX.find((s) => s.id === id);
  if (!scenario) {
    throw new Error(`Test scenario '${id}' not found in FLAG_TEST_MATRIX`);
  }
  return scenario;
}

/**
 * Get all scenarios where the form is expected to be visible
 */
export function getEnabledScenarios(): Array<FlagTestScenario> {
  return FLAG_TEST_MATRIX.filter((s) => s.expectations.formVisible);
}

/**
 * Get all scenarios where the form is expected to be hidden
 */
export function getDisabledScenarios(): Array<FlagTestScenario> {
  return FLAG_TEST_MATRIX.filter((s) => !s.expectations.formVisible);
}

/**
 * Utility to iterate over scenarios and run tests
 * This allows for concise parametrized test definitions
 *
 * @example
 * forEachScenario((scenario) => {
 *   it(`handles ${scenario.description}`, () => {
 *     cy.setFlagsCache(scenario.flags);
 *     cy.visit('/contact');
 *     if (scenario.expectations.formVisible) {
 *       cy.get('#contact-email-form').should('be.visible');
 *     } else {
 *       cy.get('#contact-email-form').should('not.exist');
 *     }
 *   });
 * });
 */
export function forEachScenario(
  testFn: (scenario: FlagTestScenario) => void,
): void {
  FLAG_TEST_MATRIX.forEach(testFn);
}

/**
 * Utility to run tests only for enabled scenarios
 */
export function forEachEnabledScenario(
  testFn: (scenario: FlagTestScenario) => void,
): void {
  getEnabledScenarios().forEach(testFn);
}

/**
 * Utility to run tests only for disabled scenarios
 */
export function forEachDisabledScenario(
  testFn: (scenario: FlagTestScenario) => void,
): void {
  getDisabledScenarios().forEach(testFn);
}
