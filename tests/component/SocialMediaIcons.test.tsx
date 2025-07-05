import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import SocialMediaIcons from "@/components/SocialMediaIcons/SocialMediaIcons.tsx";

// Mock the icon components
vi.mock("@/components/icons/GithubIcon.tsx", () => ({
  default: () => <div data-testid="github-icon">Github Icon</div>,
}));

vi.mock("@/components/icons/BlueskyIcon.tsx", () => ({
  default: () => <div data-testid="bluesky-icon">Bluesky Icon</div>,
}));

vi.mock("@/components/icons/LinkedInIcon.tsx", () => ({
  default: () => <div data-testid="linkedin-icon">LinkedIn Icon</div>,
}));

describe("<SocialMediaIcons />", () => {
  it("will render all social media icons", () => {
    render(<SocialMediaIcons />);

    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
    expect(screen.getByTestId("bluesky-icon")).toBeInTheDocument();
    expect(screen.getByTestId("linkedin-icon")).toBeInTheDocument();
  });

  it("will render Github link with correct href", () => {
    render(<SocialMediaIcons />);

    const githubLink = screen.getByTestId("github-icon").closest("a");
    expect(githubLink).toHaveAttribute(
      "href",
      "https://www.github.com/taearls",
    );
  });

  it("will render Bluesky link with correct href", () => {
    render(<SocialMediaIcons />);

    const blueskyLink = screen.getByTestId("bluesky-icon").closest("a");
    expect(blueskyLink).toHaveAttribute(
      "href",
      "https://bsky.app/profile/tylerearls.com",
    );
  });

  it("will render LinkedIn link with correct href", () => {
    render(<SocialMediaIcons />);

    const linkedinLink = screen.getByTestId("linkedin-icon").closest("a");
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/tylerearls",
    );
  });

  it("will render external links with correct attributes", () => {
    render(<SocialMediaIcons />);

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("will have correct ARIA labels", () => {
    render(<SocialMediaIcons />);

    expect(screen.getByLabelText("Go to Github")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to Bluesky")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to LinkedIn")).toBeInTheDocument();
  });

  it("will apply correct container styling", () => {
    const { container } = render(<SocialMediaIcons />);

    const containerElement = container.firstChild as HTMLElement;
    expect(containerElement).toHaveClass("flex", "justify-center", "gap-x-2");
  });

  it("will render correct number of social media links", () => {
    render(<SocialMediaIcons />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
  });

  it("will render icons with correct names", () => {
    render(<SocialMediaIcons />);

    expect(screen.getByText("Github Icon")).toBeInTheDocument();
    expect(screen.getByText("Bluesky Icon")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn Icon")).toBeInTheDocument();
  });
});
