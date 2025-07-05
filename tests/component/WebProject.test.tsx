import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import WebProject from "@/components/WebProject/WebProject.tsx";

// Mock the theme context
vi.mock("@/state/contexts/ThemeContext.tsx", () => ({
  default: {
    useActorRef: vi.fn(() => ({
      send: vi.fn(),
    })),
    useSelector: vi.fn(() => "light"),
  },
}));

// Mock the CloudinaryImage component
vi.mock("@/components/CloudinaryImage/images/WebProjectImage.tsx", () => ({
  default: ({ alt, publicId }: { alt: string; publicId: string }) => (
    <img data-testid="web-project-image" alt={alt} src={publicId} />
  ),
}));

const mockWebProject = {
  alt: "Test project screenshot",
  analytics: {
    campaign: "portfolio",
    medium: "web",
    source: "github",
  },
  cloudinaryId: {
    dark: "screenshots/project-dark",
    default: "screenshots/project-light",
  },
  descriptions: [
    "This is a test project description.",
    "It has multiple description lines.",
  ],
  height: 300,
  href: "https://example.com",
  isLast: false,
  name: "Test Project",
  tagline: "Check it out!",
  width: 500,
};

describe("<WebProject />", () => {
  it("will render project name as heading", () => {
    render(<WebProject {...mockWebProject} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Test Project",
    );
  });

  it("will render project image", () => {
    render(<WebProject {...mockWebProject} />);

    const image = screen.getByTestId("web-project-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", "Test project screenshot");
  });

  it("will render project descriptions", () => {
    render(<WebProject {...mockWebProject} />);

    expect(
      screen.getByText("This is a test project description."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("It has multiple description lines."),
    ).toBeInTheDocument();
  });

  it("will render project tagline as link", () => {
    render(<WebProject {...mockWebProject} />);

    const taglineLink = screen.getByText("Check it out!");
    expect(taglineLink).toBeInTheDocument();
    expect(taglineLink.closest("a")).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });

  it("will render external link indicator for tagline", () => {
    render(<WebProject {...mockWebProject} />);

    const taglineLink = screen.getByText("Check it out!");
    expect(taglineLink.closest("a")).toHaveAttribute("target", "_blank");
    expect(taglineLink.closest("a")).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("will render image link with analytics", () => {
    render(<WebProject {...mockWebProject} />);

    const imageLink = screen.getByTestId("web-project-image").closest("a");
    expect(imageLink).toHaveAttribute(
      "href",
      "https://example.com?utm_campaign=portfolio&utm_medium=web&source=github",
    );
  });

  it("will render image link without analytics when not provided", () => {
    const projectWithoutAnalytics = {
      ...mockWebProject,
      analytics: undefined,
    };

    render(<WebProject {...projectWithoutAnalytics} />);

    const imageLink = screen.getByTestId("web-project-image").closest("a");
    expect(imageLink).toHaveAttribute("href", "https://example.com");
  });

  it("will not render horizontal rule when isLast is true", () => {
    render(<WebProject {...mockWebProject} isLast={true} />);

    // Should not have any hr elements
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });

  it("will render horizontal rule when isLast is false", () => {
    render(<WebProject {...mockWebProject} isLast={false} />);

    // Should have hr element
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("will have correct ARIA label for image link", () => {
    render(<WebProject {...mockWebProject} />);

    const imageLink = screen.getByTestId("web-project-image").closest("a");
    expect(imageLink).toHaveAttribute("aria-label", "Navigate to Test Project");
  });

  it("will have correct ARIA label for tagline link", () => {
    render(<WebProject {...mockWebProject} />);

    const taglineLink = screen.getByText("Check it out!");
    expect(taglineLink.closest("a")).toHaveAttribute(
      "aria-label",
      "Navigate to Test Project",
    );
  });
});
