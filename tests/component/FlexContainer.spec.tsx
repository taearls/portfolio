import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import {
  AlignItemsCSSValue,
  FlexFlowCSSValue,
  JustifyContentCSSValue,
} from "@/types/layout.ts";

describe("<FlexContainer />", () => {
  describe("Base rendering", () => {
    it("should render children", () => {
      render(
        <FlexContainer>
          <span>Test content</span>
        </FlexContainer>,
      );

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should apply flex class by default", () => {
      render(
        <FlexContainer>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("flex");
    });

    it("should apply inline-flex class when inline prop is true", () => {
      render(
        <FlexContainer inline>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("inline-flex");
      expect(container).not.toHaveClass("flex");
    });
  });

  describe("wrap prop", () => {
    it("should not apply flex-wrap class by default", () => {
      render(
        <FlexContainer>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).not.toHaveClass("flex-wrap");
    });

    it("should apply flex-wrap class when wrap prop is true", () => {
      render(
        <FlexContainer wrap>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("flex-wrap");
    });

    it("should apply both flex and flex-wrap when wrap is true", () => {
      render(
        <FlexContainer wrap>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("flex");
      expect(container).toHaveClass("flex-wrap");
    });

    it("should apply both inline-flex and flex-wrap when inline and wrap are true", () => {
      render(
        <FlexContainer inline wrap>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("inline-flex");
      expect(container).toHaveClass("flex-wrap");
    });
  });

  describe("fullWidth prop", () => {
    it("should not apply w-full class by default", () => {
      render(
        <FlexContainer>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).not.toHaveClass("w-full");
    });

    it("should apply w-full class when fullWidth prop is true", () => {
      render(
        <FlexContainer fullWidth>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("w-full");
    });
  });

  describe("flexFlow prop", () => {
    it("should apply flex-row class when flexFlow is ROW", () => {
      render(
        <FlexContainer flexFlow={FlexFlowCSSValue.ROW}>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("flex-row");
    });

    it("should apply flex-col class when flexFlow is COLUMN", () => {
      render(
        <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN}>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("flex-col");
    });
  });

  describe("gap props", () => {
    it("should apply gap-x class when gapX is provided", () => {
      render(
        <FlexContainer gapX={4}>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("gap-x-4");
    });

    it("should apply gap-y class when gapY is provided", () => {
      render(
        <FlexContainer gapY={2}>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("gap-y-2");
    });

    it("should apply both gap classes when gapX and gapY are provided", () => {
      render(
        <FlexContainer gapX={4} gapY={2}>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("gap-x-4");
      expect(container).toHaveClass("gap-y-2");
    });
  });

  describe("alignment props", () => {
    it("should apply justify-center class when justifyContent is CENTER", () => {
      render(
        <FlexContainer justifyContent={JustifyContentCSSValue.CENTER}>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("justify-center");
    });

    it("should apply items-center class when alignItems is CENTER", () => {
      render(
        <FlexContainer alignItems={AlignItemsCSSValue.CENTER}>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("items-center");
    });

    it("should apply self-start class when alignSelf is START", () => {
      render(
        <FlexContainer alignSelf={AlignItemsCSSValue.START}>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("self-start");
    });
  });

  describe("id prop", () => {
    it("should apply id attribute when id prop is provided", () => {
      render(
        <FlexContainer id="my-container">
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveAttribute("id", "my-container");
    });
  });

  describe("maxWidth prop", () => {
    it("should apply maxWidth style when maxWidth prop is provided", () => {
      render(
        <FlexContainer maxWidth={500}>
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveStyle({ maxWidth: "500px" });
    });
  });

  describe("combined props", () => {
    it("should apply all props correctly when combined", () => {
      render(
        <FlexContainer
          inline
          wrap
          fullWidth
          flexFlow={FlexFlowCSSValue.ROW}
          gapX={4}
          gapY={2}
          justifyContent={JustifyContentCSSValue.CENTER}
          alignItems={AlignItemsCSSValue.CENTER}
          id="combined-container"
        >
          <span data-testid="child">Content</span>
        </FlexContainer>,
      );

      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("inline-flex");
      expect(container).toHaveClass("flex-wrap");
      expect(container).toHaveClass("w-full");
      expect(container).toHaveClass("flex-row");
      expect(container).toHaveClass("gap-x-4");
      expect(container).toHaveClass("gap-y-2");
      expect(container).toHaveClass("justify-center");
      expect(container).toHaveClass("items-center");
      expect(container).toHaveAttribute("id", "combined-container");
    });
  });
});
