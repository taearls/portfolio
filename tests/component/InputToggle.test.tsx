import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import InputToggle from "@/components/InputToggle/InputToggle.tsx";

describe("<InputToggle />", () => {
  const defaultProps = {
    id: "test-toggle",
    name: "test-toggle",
    onToggle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("will render checkbox input", () => {
    render(<InputToggle {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute("id", "test-toggle");
    expect(checkbox).toHaveAttribute("name", "test-toggle");
  });

  it("will render label for checkbox", () => {
    render(<InputToggle {...defaultProps} />);

    const label = screen.getByTestId("test-toggle-label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "test-toggle");
  });

  it("will be unchecked by default", () => {
    render(<InputToggle {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("will be checked when isChecked is true", () => {
    render(<InputToggle {...defaultProps} isChecked={true} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("will be unchecked when isChecked is false", () => {
    render(<InputToggle {...defaultProps} isChecked={false} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("will call onToggle when checkbox is clicked", () => {
    const mockOnToggle = vi.fn();
    render(<InputToggle {...defaultProps} onToggle={mockOnToggle} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it("will toggle state when clicked", () => {
    render(<InputToggle {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");

    // Initially unchecked
    expect(checkbox).not.toBeChecked();

    // Click to check
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Click to uncheck
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("will update state when isChecked prop changes", () => {
    const { rerender } = render(
      <InputToggle {...defaultProps} isChecked={false} />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    // Update to checked
    rerender(<InputToggle {...defaultProps} isChecked={true} />);
    expect(checkbox).toBeChecked();

    // Update back to unchecked
    rerender(<InputToggle {...defaultProps} isChecked={false} />);
    expect(checkbox).not.toBeChecked();
  });

  it("will apply correct CSS classes", () => {
    const { container } = render(<InputToggle {...defaultProps} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(
      "duration-800",
      "relative",
      "mr-2",
      "inline-block",
      "h-auto",
      "w-10",
      "select-none",
      "align-middle",
      "transition",
      "ease-in",
    );
  });

  it("will apply correct label classes", () => {
    render(<InputToggle {...defaultProps} />);

    const label = screen.getByTestId("test-toggle-label");
    expect(label).toHaveClass(
      "input-toggle-label",
      "block",
      "h-5",
      "cursor-pointer",
      "overflow-hidden",
      "rounded-full",
      "bg-gray-400",
    );
  });

  it("will apply correct input classes", () => {
    render(<InputToggle {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass(
      "input-toggle",
      "focus:outline-none",
      "dark:border-purple-400",
    );
  });

  it("will handle boolean isChecked prop correctly", () => {
    render(<InputToggle {...defaultProps} isChecked={true} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("will handle undefined isChecked prop", () => {
    render(<InputToggle {...defaultProps} isChecked={undefined} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });
});
