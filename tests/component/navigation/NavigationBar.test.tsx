import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import type { RouteDataItem } from "@/util/constants/data/navigation/navigationData.tsx";

import { MemoryRouter } from "react-router";

import NavigationBar from "@/components/navigation/NavigationBar/NavigationBar.tsx";

// Mock the navigation machine
vi.mock("@xstate/react", () => ({
  useMachine: vi.fn(() => [{ value: "open" }, vi.fn()]),
}));

// Mock the theme context
vi.mock("@/state/contexts/ThemeContext.tsx", () => ({
  default: {
    useSelector: vi.fn(() => "light"),
    useActorRef: vi.fn(() => ({
      send: vi.fn(),
    })),
  },
}));

const mockLinks: Array<RouteDataItem> = [
  {
    name: "Home",
    href: "/",
    ariaLabel: "Navigate to home page",
    hidden: false,
    isExternal: false,
  },
  {
    name: "Projects",
    href: "/code",
    ariaLabel: "Navigate to projects page",
    hidden: false,
    isExternal: false,
  },
  {
    name: "Contact",
    href: "/contact",
    ariaLabel: "Navigate to contact page",
    hidden: false,
    isExternal: false,
  },
];

describe("<NavigationBar />", () => {
  const renderWithRouter = (ui: React.ReactElement, { route = "/" } = {}) => {
    return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
  };

  it("will render navigation links", () => {
    renderWithRouter(<NavigationBar links={mockLinks} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("will not render hidden links", () => {
    const linksWithHidden = [
      ...mockLinks,
      {
        name: "Hidden",
        href: "/hidden",
        ariaLabel: "Hidden link",
        hidden: true,
        isExternal: false,
      },
    ];

    renderWithRouter(<NavigationBar links={linksWithHidden} />);

    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("will render external links with external indicator", () => {
    const linksWithExternal = [
      ...mockLinks,
      {
        name: "External",
        href: "https://example.com",
        ariaLabel: "External link",
        hidden: false,
        isExternal: true,
      },
    ];

    renderWithRouter(<NavigationBar links={linksWithExternal} />);

    expect(screen.getByText("External")).toBeInTheDocument();
  });

  it("will render navigation toggle", () => {
    renderWithRouter(<NavigationBar links={mockLinks} />);

    expect(screen.getByLabelText("Close Navigation")).toBeInTheDocument();
  });

  it("will render dark mode toggle when navigation is open", () => {
    renderWithRouter(<NavigationBar links={mockLinks} />);

    // The dark mode toggle should be present when navigation is open
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
  });

  it("will have correct ARIA labels on links", () => {
    renderWithRouter(<NavigationBar links={mockLinks} />);

    const homeLink = screen.getByLabelText("Navigate to home page");
    const projectsLink = screen.getByLabelText("Navigate to projects page");
    const contactLink = screen.getByLabelText("Navigate to contact page");

    expect(homeLink).toBeInTheDocument();
    expect(projectsLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
  });

  it("will render navigation container with correct role", () => {
    renderWithRouter(<NavigationBar links={mockLinks} />);

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("will render navigation list with menu role", () => {
    renderWithRouter(<NavigationBar links={mockLinks} />);

    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
  });
});
