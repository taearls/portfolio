import { vi } from "vitest";
import { createActor } from "xstate";

import {
  getInitialThemeState,
  THEME_EVENT,
  THEME_STATES,
  themeMachine,
} from "@/state/machines/themeMachine.ts";

describe("themeMachine", () => {
  let actor: ReturnType<typeof createActor<typeof themeMachine>>;

  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock document.documentElement
    Object.defineProperty(document, "documentElement", {
      value: {
        classList: {
          remove: vi.fn(),
          add: vi.fn(),
        },
      },
      writable: true,
    });
  });

  describe("getInitialThemeState", () => {
    it("will return LIGHT by default", () => {
      const result = getInitialThemeState();
      expect(result).toBe(THEME_STATES.LIGHT);
    });

    it("will return LIGHT when prefers-color-scheme: dark does not match", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const result = getInitialThemeState();
      expect(result).toBe(THEME_STATES.LIGHT);
    });

    it("will return LIGHT when matchMedia is not available", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: undefined,
      });

      const result = getInitialThemeState();
      expect(result).toBe(THEME_STATES.LIGHT);
    });
  });

  describe("initial state", () => {
    it("will start in LIGHT state by default", () => {
      actor = createActor(themeMachine);
      actor.start();

      expect(actor.getSnapshot().value).toBe(THEME_STATES.LIGHT);
    });
  });

  describe("state transitions", () => {
    beforeEach(() => {
      actor = createActor(themeMachine);
      actor.start();
    });

    it("will transition from LIGHT to DARK on toggle", () => {
      expect(actor.getSnapshot().value).toBe(THEME_STATES.LIGHT);

      actor.send({ type: THEME_EVENT.TOGGLE });

      expect(actor.getSnapshot().value).toBe(THEME_STATES.DARK);
    });

    it("will transition from DARK to LIGHT on toggle", () => {
      // First toggle to get to DARK state
      actor.send({ type: THEME_EVENT.TOGGLE });
      expect(actor.getSnapshot().value).toBe(THEME_STATES.DARK);

      // Second toggle to get back to LIGHT state
      actor.send({ type: THEME_EVENT.TOGGLE });

      expect(actor.getSnapshot().value).toBe(THEME_STATES.LIGHT);
    });
  });

  describe("DOM manipulation", () => {
    let mockDocumentElement: HTMLElement;

    beforeEach(() => {
      mockDocumentElement = {
        classList: {
          remove: vi.fn(),
          add: vi.fn(),
        },
      } as unknown as HTMLElement;

      Object.defineProperty(document, "documentElement", {
        value: mockDocumentElement,
        writable: true,
      });
    });

    it("will remove light-theme and add dark-theme when transitioning to dark", () => {
      actor = createActor(themeMachine);
      actor.start();

      actor.send({ type: THEME_EVENT.TOGGLE });

      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith(
        "light-theme",
      );
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        "dark-theme",
      );
    });

    it("will remove dark-theme and add light-theme when transitioning to light", () => {
      actor = createActor(themeMachine);
      actor.start();

      // First toggle to dark
      actor.send({ type: THEME_EVENT.TOGGLE });
      // Second toggle to light
      actor.send({ type: THEME_EVENT.TOGGLE });

      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith(
        "dark-theme",
      );
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        "light-theme",
      );
    });

    it("will handle missing documentElement gracefully", () => {
      Object.defineProperty(document, "documentElement", {
        value: null,
        writable: true,
      });

      actor = createActor(themeMachine);
      actor.start();

      // Should not throw when documentElement is null
      expect(() => {
        actor.send({ type: THEME_EVENT.TOGGLE });
      }).not.toThrow();
    });
  });
});
