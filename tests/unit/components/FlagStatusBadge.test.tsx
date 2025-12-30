/**
 * Unit tests for FlagStatusBadge component
 */

import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FlagStatusBadge from "@/components/FlagStatusBadge/FlagStatusBadge.tsx";

describe("FlagStatusBadge", () => {
  describe("when enabled", () => {
    it("should render 'Enabled' text", () => {
      render(<FlagStatusBadge enabled={true} />);

      expect(screen.getByText("Enabled")).toBeInTheDocument();
    });

    it("should have correct aria-label", () => {
      render(<FlagStatusBadge enabled={true} />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Enabled",
      );
    });

    it("should not render 'Disabled' text", () => {
      render(<FlagStatusBadge enabled={true} />);

      expect(screen.queryByText("Disabled")).not.toBeInTheDocument();
    });
  });

  describe("when disabled", () => {
    it("should render 'Disabled' text", () => {
      render(<FlagStatusBadge enabled={false} />);

      expect(screen.getByText("Disabled")).toBeInTheDocument();
    });

    it("should have correct aria-label", () => {
      render(<FlagStatusBadge enabled={false} />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Disabled",
      );
    });

    it("should not render 'Enabled' text", () => {
      render(<FlagStatusBadge enabled={false} />);

      expect(screen.queryByText("Enabled")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have role='status'", () => {
      render(<FlagStatusBadge enabled={true} />);

      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should have indicator with aria-hidden", () => {
      const { container } = render(<FlagStatusBadge enabled={true} />);

      const indicator = container.querySelector("[aria-hidden='true']");
      expect(indicator).toBeInTheDocument();
    });
  });
});
