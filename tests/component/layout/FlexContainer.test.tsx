import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import {
  AlignItemsCSSValue,
  FlexFlowCSSValue,
  JustifyContentCSSValue,
} from "@/types/layout.ts";

describe("<FlexContainer />", () => {
  it("will render children", () => {
    render(
      <FlexContainer>
        <div data-testid="child">Test Content</div>
      </FlexContainer>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("will apply flex-flow column by default", () => {
    const { container } = render(
      <FlexContainer>
        <div>Test</div>
      </FlexContainer>,
    );

    const flexContainer = container.firstChild as HTMLElement;
    expect(flexContainer).toHaveClass("flex");
  });

  it("will apply custom flex-flow", () => {
    const { container } = render(
      <FlexContainer flexFlow={FlexFlowCSSValue.ROW}>
        <div>Test</div>
      </FlexContainer>,
    );

    const flexContainer = container.firstChild as HTMLElement;
    expect(flexContainer).toHaveClass("flex", "flex-row");
  });

  it("will apply gap classes", () => {
    const { container } = render(
      <FlexContainer gapX={4} gapY={2}>
        <div>Test</div>
      </FlexContainer>,
    );

    const flexContainer = container.firstChild as HTMLElement;
    expect(flexContainer).toHaveClass("gap-x-4", "gap-y-2");
  });

  it("will apply alignment classes", () => {
    const { container } = render(
      <FlexContainer
        alignItems={AlignItemsCSSValue.CENTER}
        justifyContent={JustifyContentCSSValue.CENTER}
      >
        <div>Test</div>
      </FlexContainer>,
    );

    const flexContainer = container.firstChild as HTMLElement;
    expect(flexContainer).toHaveClass("items-center", "justify-center");
  });

  it("will apply responsive classes", () => {
    const { container } = render(
      <FlexContainer
        responsive={{
          flexFlow: { prefix: "md" as const, value: FlexFlowCSSValue.ROW },
        }}
      >
        <div>Test</div>
      </FlexContainer>,
    );

    const flexContainer = container.firstChild as HTMLElement;
    expect(flexContainer).toHaveClass("md:flex-row");
  });

  it("will apply inline display", () => {
    const { container } = render(
      <FlexContainer inline>
        <div>Test</div>
      </FlexContainer>,
    );

    const flexContainer = container.firstChild as HTMLElement;
    expect(flexContainer).toHaveClass("inline-flex");
  });

  it("will apply max width", () => {
    const { container } = render(
      <FlexContainer maxWidth={500}>
        <div>Test</div>
      </FlexContainer>,
    );

    const flexContainer = container.firstChild as HTMLElement;
    const expectedStyle = { maxWidth: "500px" };
    expect(flexContainer).toHaveStyle(expectedStyle);
  });

  it("will apply full width", () => {
    const { container } = render(
      <FlexContainer fullWidth>
        <div>Test</div>
      </FlexContainer>,
    );

    const flexContainer = container.firstChild as HTMLElement;
    expect(flexContainer).toHaveClass("w-full");
  });

  it("will apply align self", () => {
    const { container } = render(
      <FlexContainer alignSelf={AlignItemsCSSValue.START}>
        <div>Test</div>
      </FlexContainer>,
    );

    const flexContainer = container.firstChild as HTMLElement;
    expect(flexContainer).toHaveClass("self-start");
  });
});
