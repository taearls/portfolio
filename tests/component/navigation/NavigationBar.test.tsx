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
    useActorRef: vi.fn(() => ({
      send: vi.fn(),
    })),
    useSelector: vi.fn(() => "light"),
  },
}));

const mockLinks: Array<RouteDataItem> = [
  {
    ariaLabel: "Navigate to home page",
    hidden: false,
    href: "/",
    isExternal: false,
    name: "Home",
  },
  {
    ariaLabel: "Navigate to projects page",
    hidden: false,
    href: "/code",
    isExternal: false,
    name: "Projects",
  },
  {
    ariaLabel: "Navigate to contact page",
    hidden: false,
    href: "/contact",
    isExternal: false,
    name: "Contact",
  },
];

const linksWithHidden: Array<RouteDataItem> = [
  ...mockLinks,
  {
    ariaLabel: "Hidden link",
    hidden: true,
    href: "/hidden",
    isExternal: false,
    name: "Hidden",
  },
];

const linksWithExternal: Array<RouteDataItem> = [
  ...mockLinks,
  {
    ariaLabel: "External link",
    hidden: false,
    href: "https://example.com",
    isExternal: true,
    name: "External",
  },
];

const defaultInitialEntries = ["/"];

describe("<NavigationBar />", () => {
  const renderWithRouter = (ui: React.ReactElement, { route = "/" } = {}) => {
    const initialEntries = route === "/" ? defaultInitialEntries : [route];
    return render(
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>,
    );
  };

  it("will render navigation links", () => {
    renderWithRouter(<NavigationBar links={mockLinks} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("will not render hidden links", () => {
    renderWithRouter(<NavigationBar links={linksWithHidden} />);

    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("will render external links with external indicator", () => {
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
