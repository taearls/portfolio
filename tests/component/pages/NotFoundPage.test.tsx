import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { MemoryRouter } from "react-router";

import NotFoundPage from "@/pages/NotFoundPage.tsx";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("<NotFoundPage />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location
    Object.defineProperty(window, "location", {
      value: {
        hash: "",
        host: "localhost:3000",
        pathname: "/nonexistent",
        search: "",
      },
      writable: true,
    });
  });

  const defaultInitialEntries = ["/nonexistent"];

  const renderWithRouter = (
    ui: React.ReactElement,
    { route = "/nonexistent" } = {},
  ) => {
    const initialEntries =
      route === "/nonexistent" ? defaultInitialEntries : [route];
    return render(
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>,
    );
  };

  it("will render 404 heading", () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Oh no!",
    );
  });

  it("will render error message with current URL", () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByTestId("does-not-exist")).toHaveTextContent(
      "localhost:3000/nonexistent does not exist.",
    );
  });

  it("will render return button", () => {
    renderWithRouter(<NotFoundPage />);

    const button = screen.getByRole("button", {
      name: "Return to Previous Page",
    });
    expect(button).toBeInTheDocument();
  });

  it("will call navigate(-1) when return button is clicked", () => {
    renderWithRouter(<NotFoundPage />);

    const button = screen.getByRole("button", {
      name: "Return to Previous Page",
    });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("will render main element", () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("will display correct URL with pathname, search, and hash", () => {
    // Only set the host, let the router control the rest
    Object.defineProperty(window, "location", {
      value: {
        host: "example.com",
      },
      writable: true,
    });

    renderWithRouter(<NotFoundPage />, {
      route: "/test?param=value#section",
    });

    expect(screen.getByTestId("does-not-exist")).toHaveTextContent(
      "example.com/test?param=value#section does not exist.",
    );
  });

  it("will apply correct button styling", () => {
    renderWithRouter(<NotFoundPage />);

    const button = screen.getByRole("button", {
      name: "Return to Previous Page",
    });
    expect(button).toHaveClass("accent", "w-fit", "text-xl", "underline");
  });

  it("will render code element for URL", () => {
    renderWithRouter(<NotFoundPage />);

    const codeElement = screen.getByText("localhost:3000/nonexistent");
    expect(codeElement.tagName).toBe("CODE");
  });

  it("will handle different routes correctly", () => {
    Object.defineProperty(window, "location", {
      value: {
        host: "localhost:3000",
      },
      writable: true,
    });

    renderWithRouter(<NotFoundPage />, {
      route: "/different-route",
    });

    expect(screen.getByTestId("does-not-exist")).toHaveTextContent(
      "localhost:3000/different-route does not exist.",
    );
  });
});
