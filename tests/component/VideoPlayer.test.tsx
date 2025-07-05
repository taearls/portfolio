import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import VideoPlayer from "@/components/VideoPlayer/VideoPlayer.tsx";

describe("<VideoPlayer />", () => {
  const defaultProps = {
    src: "https://www.youtube.com/embed/test",
    title: "Test Video",
  };

  it("will render iframe with correct src", () => {
    render(<VideoPlayer {...defaultProps} />);

    const iframe = screen.getByTitle("Test Video");
    expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/test");
  });

  it("will render iframe with default title when not provided", () => {
    render(
      <VideoPlayer
        title="Embedded Video Player"
        src="https://www.youtube.com/embed/test"
      />,
    );

    const iframe = screen.getByTitle("Embedded Video Player");
    expect(iframe).toBeInTheDocument();
  });

  it("will apply default width and height", () => {
    render(<VideoPlayer {...defaultProps} />);

    const iframe = screen.getByTitle("Test Video");
    expect(iframe).toHaveAttribute("width", "560");
    expect(iframe).toHaveAttribute("height", "315");
  });

  it("will apply custom width and height", () => {
    render(<VideoPlayer {...defaultProps} width={800} height={600} />);

    const iframe = screen.getByTitle("Test Video");
    expect(iframe).toHaveAttribute("width", "800");
    expect(iframe).toHaveAttribute("height", "600");
  });

  it("will apply string width and height", () => {
    render(<VideoPlayer {...defaultProps} width="100%" height="400px" />);

    const iframe = screen.getByTitle("Test Video");
    expect(iframe).toHaveAttribute("width", "100%");
    expect(iframe).toHaveAttribute("height", "400px");
  });

  it("will enable fullscreen by default", () => {
    render(<VideoPlayer {...defaultProps} />);

    const iframe = screen.getByTitle("Test Video");
    expect(iframe).toHaveAttribute("allowFullScreen");
  });

  it("will disable fullscreen when specified", () => {
    render(<VideoPlayer {...defaultProps} allowFullScreen={false} />);

    const iframe = screen.getByTitle("Test Video");
    expect(iframe).not.toHaveAttribute("allowFullScreen");
  });

  it("will apply correct allow attribute", () => {
    render(<VideoPlayer {...defaultProps} />);

    const iframe = screen.getByTitle("Test Video");
    expect(iframe).toHaveAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
    );
  });

  it("will apply correct referrer policy", () => {
    render(<VideoPlayer {...defaultProps} />);

    const iframe = screen.getByTitle("Test Video");
    expect(iframe).toHaveAttribute(
      "referrerPolicy",
      "strict-origin-when-cross-origin",
    );
  });

  it("will apply max width style", () => {
    render(<VideoPlayer {...defaultProps} />);

    const iframe = screen.getByTitle("Test Video");
    expect(iframe).toHaveStyle({ maxWidth: "var(--max-width-mobile)" });
  });

  it("will render with correct role", () => {
    render(<VideoPlayer {...defaultProps} />);

    const iframe = screen.getByTitle("Test Video");
    expect(iframe).toBeInTheDocument();
  });
});
