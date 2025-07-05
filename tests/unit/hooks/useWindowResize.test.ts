import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

import useWindowResize from "@/hooks/useWindowResize.ts";

describe("useWindowResize", () => {
  let mockAddEventListener: ReturnType<typeof vi.fn>;
  let mockRemoveEventListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockAddEventListener = vi.fn();
    mockRemoveEventListener = vi.fn();

    Object.defineProperty(window, "addEventListener", {
      value: mockAddEventListener,
      writable: true,
    });

    Object.defineProperty(window, "removeEventListener", {
      value: mockRemoveEventListener,
      writable: true,
    });
  });

  it("will add resize event listener on mount", () => {
    const mockCallback = vi.fn();

    renderHook(() => useWindowResize(mockCallback));

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });

  it("will call callback immediately on mount", () => {
    const mockCallback = vi.fn();

    renderHook(() => useWindowResize(mockCallback));

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("will call callback when resize event fires", () => {
    const mockCallback = vi.fn();
    let resizeHandler: (() => void) | undefined;

    mockAddEventListener.mockImplementation((event, handler) => {
      if (event === "resize") {
        resizeHandler = handler;
      }
    });

    renderHook(() => useWindowResize(mockCallback));

    // Simulate resize event
    if (resizeHandler) {
      resizeHandler();
    }

    expect(mockCallback).toHaveBeenCalledTimes(2); // Once on mount, once on resize
  });

  it("will remove event listener on unmount", () => {
    const mockCallback = vi.fn();

    const { unmount } = renderHook(() => useWindowResize(mockCallback));

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });

  it("will update callback when dependencies change", () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();

    const { rerender } = renderHook(
      ({ callback }) => useWindowResize(callback),
      { initialProps: { callback: mockCallback1 } },
    );

    // Clear the initial calls
    mockCallback1.mockClear();
    mockCallback2.mockClear();

    rerender({ callback: mockCallback2 });

    expect(mockCallback2).toHaveBeenCalledTimes(1);
    expect(mockCallback1).not.toHaveBeenCalled();
  });

  it("will handle empty dependency array", () => {
    const mockCallback = vi.fn();

    renderHook(() => useWindowResize(mockCallback, []));

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });

  it("will handle undefined dependencies", () => {
    const mockCallback = vi.fn();

    renderHook(() => useWindowResize(mockCallback, undefined));

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });
});
