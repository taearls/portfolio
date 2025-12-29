/**
 * Unit tests for useOnPropChange hook
 */

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useOnPropChange from "@/hooks/useOnPropChange.ts";

describe("useOnPropChange", () => {
  describe("callback execution", () => {
    it("should NOT fire callback on initial render", () => {
      const onChange = vi.fn();

      renderHook(() => useOnPropChange("initial", onChange));

      expect(onChange).not.toHaveBeenCalled();
    });

    it("should fire callback when value changes", () => {
      const onChange = vi.fn();

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange),
        { initialProps: { value: "first" } },
      );

      expect(onChange).not.toHaveBeenCalled();

      rerender({ value: "second" });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("should NOT fire callback when value remains the same", () => {
      const onChange = vi.fn();

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange),
        { initialProps: { value: "same" } },
      );

      rerender({ value: "same" });
      rerender({ value: "same" });
      rerender({ value: "same" });

      expect(onChange).not.toHaveBeenCalled();
    });

    it("should fire callback multiple times for multiple changes", () => {
      const onChange = vi.fn();

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange),
        { initialProps: { value: 1 } },
      );

      rerender({ value: 2 });
      rerender({ value: 3 });
      rerender({ value: 4 });

      expect(onChange).toHaveBeenCalledTimes(3);
    });
  });

  describe("callback arguments", () => {
    it("should receive correct previous and current values", () => {
      const onChange = vi.fn();

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange),
        { initialProps: { value: "first" } },
      );

      rerender({ value: "second" });

      expect(onChange).toHaveBeenCalledWith("first", "second");
    });

    it("should track previous value correctly across multiple changes", () => {
      const onChange = vi.fn();

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange),
        { initialProps: { value: 1 } },
      );

      rerender({ value: 2 });
      expect(onChange).toHaveBeenLastCalledWith(1, 2);

      rerender({ value: 3 });
      expect(onChange).toHaveBeenLastCalledWith(2, 3);

      rerender({ value: 10 });
      expect(onChange).toHaveBeenLastCalledWith(3, 10);
    });

    it("should pass object references correctly", () => {
      const onChange = vi.fn();
      const obj1 = { id: 1, name: "first" };
      const obj2 = { id: 2, name: "second" };

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange),
        { initialProps: { value: obj1 } },
      );

      rerender({ value: obj2 });

      expect(onChange).toHaveBeenCalledWith(obj1, obj2);
    });
  });

  describe("custom equality function", () => {
    it("should use custom isEqual function", () => {
      const onChange = vi.fn();
      const customIsEqual = (a: { id: number }, b: { id: number }) =>
        a.id === b.id;

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange, customIsEqual),
        { initialProps: { value: { id: 1, name: "first" } } },
      );

      // Same id, different name - should NOT trigger
      rerender({ value: { id: 1, name: "updated" } });
      expect(onChange).not.toHaveBeenCalled();

      // Different id - should trigger
      rerender({ value: { id: 2, name: "second" } });
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("should call custom equality function with correct arguments", () => {
      const customIsEqual = vi.fn(() => true);
      const onChange = vi.fn();

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange, customIsEqual),
        { initialProps: { value: "first" } },
      );

      rerender({ value: "second" });

      // isEqual should receive (newValue, previousValue)
      expect(customIsEqual).toHaveBeenCalledWith("second", "first");
    });

    it("should not trigger onChange when custom equality returns true", () => {
      const onChange = vi.fn();
      const alwaysEqual = () => true;

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange, alwaysEqual),
        { initialProps: { value: 1 } },
      );

      rerender({ value: 2 });
      rerender({ value: 3 });
      rerender({ value: 100 });

      expect(onChange).not.toHaveBeenCalled();
    });

    it("should always trigger onChange when custom equality returns false", () => {
      const onChange = vi.fn();
      const neverEqual = () => false;

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange, neverEqual),
        { initialProps: { value: "same" } },
      );

      // Clear any calls from initial render (Strict Mode may cause extra renders)
      const initialCallCount = onChange.mock.calls.length;

      // Even with the same value, neverEqual means it should fire
      rerender({ value: "same" });
      rerender({ value: "same" });

      // Should have 2 more calls from the rerenders
      expect(onChange).toHaveBeenCalledTimes(initialCallCount + 2);
    });
  });

  describe("edge cases", () => {
    it("should handle undefined values", () => {
      const onChange = vi.fn();

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange),
        { initialProps: { value: undefined as string | undefined } },
      );

      rerender({ value: "defined" });
      expect(onChange).toHaveBeenCalledWith(undefined, "defined");

      rerender({ value: undefined });
      expect(onChange).toHaveBeenCalledWith("defined", undefined);
    });

    it("should handle null values", () => {
      const onChange = vi.fn();

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange),
        { initialProps: { value: null as string | null } },
      );

      rerender({ value: "not null" });
      expect(onChange).toHaveBeenCalledWith(null, "not null");

      rerender({ value: null });
      expect(onChange).toHaveBeenCalledWith("not null", null);
    });

    it("should handle boolean values", () => {
      const onChange = vi.fn();

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange),
        { initialProps: { value: false } },
      );

      rerender({ value: true });
      expect(onChange).toHaveBeenCalledWith(false, true);

      rerender({ value: false });
      expect(onChange).toHaveBeenCalledWith(true, false);
    });

    it("should handle array values with default equality (reference check)", () => {
      const onChange = vi.fn();
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 3]; // Same content, different reference

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange),
        { initialProps: { value: arr1 } },
      );

      // Different reference should trigger
      rerender({ value: arr2 });
      expect(onChange).toHaveBeenCalledTimes(1);

      // Same reference should not trigger
      rerender({ value: arr2 });
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("should handle NaN values correctly with default equality", () => {
      const onChange = vi.fn();

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange),
        { initialProps: { value: NaN } },
      );

      // NaN !== NaN in JavaScript, so this will trigger
      rerender({ value: NaN });
      expect(onChange).toHaveBeenCalled();
    });

    it("should handle NaN correctly with custom equality using Object.is", () => {
      const onChange = vi.fn();
      const objectIs = (a: number, b: number) => Object.is(a, b);

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange, objectIs),
        { initialProps: { value: NaN } },
      );

      // Object.is(NaN, NaN) is true, so this should NOT trigger
      rerender({ value: NaN });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("type safety", () => {
    it("should work with union types", () => {
      const onChange = vi.fn();
      type Status = "idle" | "loading" | "success" | "error";

      const { rerender } = renderHook(
        ({ value }) => useOnPropChange(value, onChange),
        { initialProps: { value: "idle" as Status } },
      );

      rerender({ value: "loading" as Status });
      expect(onChange).toHaveBeenCalledWith("idle", "loading");
    });

    it("should work with complex object types", () => {
      const onChange = vi.fn();
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const user1: User = { id: 1, name: "Alice", email: "alice@test.com" };
      const user2: User = { id: 2, name: "Bob", email: "bob@test.com" };

      const { rerender } = renderHook(
        ({ value }) =>
          useOnPropChange(value, onChange, (a, b) => a.id === b.id),
        { initialProps: { value: user1 } },
      );

      rerender({ value: user2 });
      expect(onChange).toHaveBeenCalledWith(user1, user2);
    });
  });
});
