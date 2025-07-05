import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner.tsx";

describe("<LoadingSpinner />", () => {
  let container: HTMLElement;
  let spinner: HTMLElement;

  beforeAll(() => {
    const renderResult = render(<LoadingSpinner />);
    container = renderResult.container;
    spinner = container.firstChild as HTMLElement;
  });

  it("will render spinner element", () => {
    expect(spinner).toBeInTheDocument();
  });

  it("will apply loading spinner CSS class", () => {
    expect(spinner.className).toMatch(/loading-spinner/);
  });

  it("will render as a div element", () => {
    expect(spinner.tagName).toBe("DIV");
  });

  it("will not have any children", () => {
    expect(spinner.children).toHaveLength(0);
  });

  it("will not have any text content", () => {
    expect(spinner.textContent).toBe("");
  });
});
