/**
 * Test Matrix for Feature Flags Integration Tests
 *
 * This module provides a centralized test matrix constant that defines
 * all feature flag configurations and their expected outcomes. Tests
 * use this matrix to ensure comprehensive coverage across different
 * flag states.
 *
 * Implements the parametrized test matrix pattern for:
 * - contact-form.cy.ts
 * - feature-flags.cy.ts
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
export const FLAG_TEST_MATRIX: FlagTestScenario[] = [
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
        message: "Contact form is temporarily unavailable. Please try again later.",
      },
    },
    expectations: {
      formVisible: false,
      showsMessage: true,
      messageText: "Contact form is temporarily unavailable. Please try again later.",
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
export function getEnabledScenarios(): FlagTestScenario[] {
  return FLAG_TEST_MATRIX.filter((s) => s.expectations.formVisible);
}

/**
 * Get all scenarios where the form is expected to be hidden
 */
export function getDisabledScenarios(): FlagTestScenario[] {
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
  testFn: (scenario: FlagTestScenario) => void
): void {
  FLAG_TEST_MATRIX.forEach(testFn);
}

/**
 * Utility to run tests only for enabled scenarios
 */
export function forEachEnabledScenario(
  testFn: (scenario: FlagTestScenario) => void
): void {
  getEnabledScenarios().forEach(testFn);
}

/**
 * Utility to run tests only for disabled scenarios
 */
export function forEachDisabledScenario(
  testFn: (scenario: FlagTestScenario) => void
): void {
  getDisabledScenarios().forEach(testFn);
}
