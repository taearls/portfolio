import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner.tsx";

describe("<LoadingSpinner />", () => {
  it("will render spinner element", () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toBeInTheDocument();
  });

  it("will apply loading spinner CSS class", () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.firstChild as HTMLElement;
    expect(spinner.className).toMatch(/loading-spinner/);
  });

  it("will render as a div element", () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.firstChild as HTMLElement;
    expect(spinner.tagName).toBe("DIV");
  });

  it("will not have any children", () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.firstChild as HTMLElement;
    expect(spinner.children).toHaveLength(0);
  });

  it("will not have any text content", () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.firstChild as HTMLElement;
    expect(spinner.textContent).toBe("");
  });
});
