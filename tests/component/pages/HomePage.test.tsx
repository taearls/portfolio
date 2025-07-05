import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import HomePage from "@/pages/HomePage.tsx";

// Mock the CloudinaryImage component
vi.mock(
  "@/components/CloudinaryImage/images/TylerInFrontOfBrickWallSmilingImage.tsx",
  () => ({
    default: () => <div data-testid="profile-image">Profile Image</div>,
  }),
);

describe("<HomePage />", () => {
  it("will render main heading", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Hi there!",
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "My name is Tyler Earls.",
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "I am a software engineer and musician.",
    );
  });

  it("will render profile image", () => {
    render(<HomePage />);

    expect(screen.getByTestId("profile-image")).toBeInTheDocument();
  });

  it("will render professional description", () => {
    render(<HomePage />);

    expect(
      screen.getByText(/Professionally, I write fullstack web applications/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Inspire11/)).toBeInTheDocument();
    expect(screen.getByText(/React, Java, C#, and Rust/)).toBeInTheDocument();
  });

  it("will render Inspire11 link with correct attributes", () => {
    render(<HomePage />);

    const inspire11Link = screen.getByText("Inspire11");
    expect(inspire11Link.closest("a")).toHaveAttribute(
      "href",
      "https://www.inspire11.com",
    );
    expect(inspire11Link.closest("a")).toHaveAttribute("target", "_blank");
    expect(inspire11Link.closest("a")).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("will render music description", () => {
    render(<HomePage />);

    expect(
      screen.getByText(/Outside of tech, I write songs/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Cuckoo and the Birds/)).toBeInTheDocument();
  });

  it("will render Cuckoo and the Birds link", () => {
    render(<HomePage />);

    const bandLink = screen.getByText("Cuckoo and the Birds");
    expect(bandLink.closest("a")).toHaveAttribute(
      "href",
      "https://www.cuckooandthebirds.com/",
    );
    expect(bandLink.closest("a")).toHaveAttribute("target", "_blank");
    expect(bandLink.closest("a")).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("will render Bandcamp link", () => {
    render(<HomePage />);

    const bandcampLink = screen.getByText("Bandcamp");
    expect(bandcampLink.closest("a")).toHaveAttribute(
      "href",
      "https://cuckooandthebirds.bandcamp.com",
    );
    expect(bandcampLink.closest("a")).toHaveAttribute("target", "_blank");
    expect(bandcampLink.closest("a")).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("will render Star Trek description", () => {
    render(<HomePage />);

    expect(
      screen.getByText(/I'm also a very avid Star Trek fan/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/optimistic view on the potential of humanity/),
    ).toBeInTheDocument();
  });

  it("will render main element", () => {
    render(<HomePage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("will have correct ARIA labels on external links", () => {
    render(<HomePage />);

    expect(
      screen.getByLabelText("Go to Inspire11's website"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Go the Cuckoo and the Birds website"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Go to the Cuckoo and the Birds bandcamp"),
    ).toBeInTheDocument();
  });

  it("will apply correct container styling", () => {
    const { container } = render(<HomePage />);

    const mainElement = container.querySelector("main");
    expect(mainElement).toBeInTheDocument();
  });
});
