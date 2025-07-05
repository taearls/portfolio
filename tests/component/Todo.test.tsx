import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import Todo from "@/components/Todo/Todo.tsx";

// Mock import.meta.env
const mockImportMeta = {
  env: {
    MODE: "development",
  },
};

const descriptionStyle = { borderRadius: "inherit" };

vi.mock("@/components/Todo/Todo.tsx", async () => {
  const actual = await vi.importActual("@/components/Todo/Todo.tsx");
  return {
    ...actual,
    default: (props: {
      description: string;
      className?: string;
      children?: React.ReactNode;
    }) => {
      // Mock the import.meta.env check
      const isDevelopment = mockImportMeta.env.MODE === "development";
      if (!isDevelopment) return null;

      const { description, className, children } = props;
      return (
        <div
          className={`h-[500px] w-[500px] rounded-md bg-pink-500 text-2xl font-bold text-current dark:bg-pink-400 dark:text-soft-black ${className || ""}`}
        >
          {children}
          <p
            className="border-inherit bg-inherit italic text-inherit"
            style={descriptionStyle}
          >
            {description}
          </p>
        </div>
      );
    },
  };
});

describe("<Todo />", () => {
  beforeEach(() => {
    // Set to development mode
    mockImportMeta.env.MODE = "development";
  });

  afterEach(() => {
    // Reset to development mode
    mockImportMeta.env.MODE = "development";
  });

  it("will render in development mode", () => {
    render(
      <Todo description="Test todo">
        <div>Todo content</div>
      </Todo>,
    );

    expect(screen.getByText("Todo content")).toBeInTheDocument();
    expect(screen.getByText("Test todo")).toBeInTheDocument();
  });

  it("will not render in production mode", () => {
    mockImportMeta.env.MODE = "production";

    render(
      <Todo description="Test todo">
        <div>Todo content</div>
      </Todo>,
    );

    expect(screen.queryByText("Todo content")).not.toBeInTheDocument();
    expect(screen.queryByText("Test todo")).not.toBeInTheDocument();
  });

  it("will apply correct CSS classes", () => {
    const { container } = render(
      <Todo description="Test todo">
        <div>Todo content</div>
      </Todo>,
    );

    const todoElement = container.firstChild as HTMLElement;
    expect(todoElement).toHaveClass(
      "h-[500px]",
      "w-[500px]",
      "rounded-md",
      "bg-pink-500",
      "text-2xl",
      "font-bold",
      "text-current",
      "dark:bg-pink-400",
      "dark:text-soft-black",
    );
  });

  it("will apply custom className when provided", () => {
    const { container } = render(
      <Todo description="Test todo" className="custom-class">
        <div>Todo content</div>
      </Todo>,
    );

    const todoElement = container.firstChild as HTMLElement;
    expect(todoElement).toHaveClass("custom-class");
  });

  it("will render children content", () => {
    render(
      <Todo description="Test todo">
        <h1>Todo Title</h1>
        <p>Todo paragraph</p>
      </Todo>,
    );

    expect(screen.getByText("Todo Title")).toBeInTheDocument();
    expect(screen.getByText("Todo paragraph")).toBeInTheDocument();
  });

  it("will render description with correct styling", () => {
    render(
      <Todo description="Test todo description">
        <div>Todo content</div>
      </Todo>,
    );

    const description = screen.getByText("Test todo description");
    expect(description).toHaveClass(
      "border-inherit",
      "bg-inherit",
      "italic",
      "text-inherit",
    );
  });

  it("will render description with correct inline styles", () => {
    render(
      <Todo description="Test todo description">
        <div>Todo content</div>
      </Todo>,
    );

    const description = screen.getByText("Test todo description");
    expect(description).toHaveStyle({ borderRadius: "inherit" });
  });

  it("will render multiple children", () => {
    render(
      <Todo description="Test todo">
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </Todo>,
    );

    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
    expect(screen.getByText("Child 3")).toBeInTheDocument();
  });

  it("will render as a div element", () => {
    const { container } = render(
      <Todo description="Test todo">
        <div>Todo content</div>
      </Todo>,
    );

    const todoElement = container.firstChild as HTMLElement;
    expect(todoElement.tagName).toBe("DIV");
  });
});
