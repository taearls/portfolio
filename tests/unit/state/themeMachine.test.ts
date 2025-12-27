import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getInitialThemeState,
  THEME_STATES,
} from "@/state/machines/themeMachine.ts";

describe("themeMachine", () => {
  describe("getInitialThemeState", () => {
    const originalMatchMedia = window.matchMedia;

    beforeEach(() => {
      vi.resetAllMocks();
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it("returns DARK when user prefers dark color scheme", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      }));

      expect(getInitialThemeState()).toBe(THEME_STATES.DARK);
    });

    it("returns LIGHT when user prefers light color scheme", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-color-scheme: light)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      }));

      expect(getInitialThemeState()).toBe(THEME_STATES.LIGHT);
    });

    it("returns LIGHT when matchMedia is not supported", () => {
      // @ts-expect-error - testing edge case where matchMedia doesn't exist
      window.matchMedia = undefined;

      expect(getInitialThemeState()).toBe(THEME_STATES.LIGHT);
    });
  });
});
