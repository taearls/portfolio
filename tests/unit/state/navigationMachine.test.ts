import { vi } from "vitest";
import { createActor } from "xstate";

import {
  NAVIGATION_EVENT,
  NAVIGATION_STATE,
  navigationMachine,
} from "@/state/machines/navigationMachine.ts";

describe("navigationMachine", () => {
  let actor: ReturnType<typeof createActor<typeof navigationMachine>>;

  beforeEach(() => {
    // Mock window.innerWidth for consistent testing
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024, // Desktop width
    });

    // Mock setTimeout to execute immediately
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("will start in OPEN state on desktop", async () => {
      window.innerWidth = 1024;
      vi.resetModules();
      const { navigationMachine, NAVIGATION_STATE } = await import(
        "@/state/machines/navigationMachine.ts"
      );
      actor = createActor(navigationMachine);
      actor.start();

      expect(actor.getSnapshot().value).toBe(NAVIGATION_STATE.OPEN);
    });

    it("will start in CLOSED state on mobile", async () => {
      window.innerWidth = 375;
      vi.resetModules();
      const { navigationMachine, NAVIGATION_STATE } = await import(
        "@/state/machines/navigationMachine.ts"
      );
      actor = createActor(navigationMachine);
      actor.start();

      expect(actor.getSnapshot().value).toBe(NAVIGATION_STATE.CLOSED);
    });
  });

  describe("state transitions", () => {
    beforeEach(() => {
      actor = createActor(navigationMachine);
      actor.start();
    });

    it("will transition from OPEN to CLOSED on toggle", () => {
      expect(actor.getSnapshot().value).toBe(NAVIGATION_STATE.OPEN);

      actor.send({ type: NAVIGATION_EVENT.TOGGLE });

      expect(actor.getSnapshot().value).toBe(NAVIGATION_STATE.CLOSED);
    });

    it("will transition from CLOSED to OPEN on toggle", () => {
      // First toggle to get to CLOSED state
      actor.send({ type: NAVIGATION_EVENT.TOGGLE });
      expect(actor.getSnapshot().value).toBe(NAVIGATION_STATE.CLOSED);

      // Second toggle to get back to OPEN state
      actor.send({ type: NAVIGATION_EVENT.TOGGLE });

      expect(actor.getSnapshot().value).toBe(NAVIGATION_STATE.OPEN);
    });

    it("will execute checkNavHeight action on toggle", () => {
      // Mock the checkNavHeight function
      const mockCheckNavHeight = vi.fn();
      vi.spyOn(global, "setTimeout").mockImplementation(() => {
        mockCheckNavHeight();
        return 1 as unknown as ReturnType<typeof setTimeout>;
      });

      actor.send({ type: NAVIGATION_EVENT.TOGGLE });

      expect(mockCheckNavHeight).toHaveBeenCalled();
    });
  });

  describe("checkNavHeight function", () => {
    it("will update page container margin when elements exist", async () => {
      // Create mock DOM elements
      const mockPageContainer = document.createElement("div");
      mockPageContainer.id = "page-container";
      mockPageContainer.style.marginTop = "0px";

      const mockNavigationBar = document.createElement("nav");
      mockNavigationBar.id = "navigation-bar";
      Object.defineProperty(mockNavigationBar, "offsetHeight", {
        value: 60,
        writable: false,
      });

      document.body.appendChild(mockPageContainer);
      document.body.appendChild(mockNavigationBar);

      // Import and call the function
      const { checkNavHeight } = await import(
        "@/state/machines/navigationMachine.ts"
      );
      checkNavHeight();

      expect(mockPageContainer.style.marginTop).toBe("60px");

      // Cleanup
      document.body.removeChild(mockPageContainer);
      document.body.removeChild(mockNavigationBar);
    });

    it("will not update margin when elements do not exist", async () => {
      const { checkNavHeight } = await import(
        "@/state/machines/navigationMachine.ts"
      );

      // Should not throw when elements don't exist
      expect(() => checkNavHeight()).not.toThrow();
    });
  });
});
