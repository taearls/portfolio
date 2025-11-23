import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CloudinaryImage from "@/components/CloudinaryImage/CloudinaryImage.tsx";

describe("<CloudinaryImage /> - CLS Optimization", () => {
  describe("aspect ratio preservation", () => {
    it("should apply aspect-ratio style when width and height are provided", () => {
      render(
        <CloudinaryImage
          alt="Test image"
          publicId="test-image"
          width={1200}
          height={630}
        />,
      );

      const img = screen.getByAltText("Test image") as HTMLImageElement;

      // Check that aspect-ratio is set in inline styles
      expect(img.style.aspectRatio).toBe("1200 / 630");
    });

    it("should not apply aspect-ratio when width is missing", () => {
      render(
        <CloudinaryImage
          alt="Test image"
          publicId="test-image"
          height={630}
        />,
      );

      const img = screen.getByAltText("Test image") as HTMLImageElement;

      // aspectRatio should be undefined when width is missing
      expect(img.style.aspectRatio).toBe("");
    });

    it("should not apply aspect-ratio when height is missing", () => {
      render(
        <CloudinaryImage
          alt="Test image"
          publicId="test-image"
          width={1200}
        />,
      );

      const img = screen.getByAltText("Test image") as HTMLImageElement;

      // aspectRatio should be undefined when height is missing
      expect(img.style.aspectRatio).toBe("");
    });

    it("should not apply aspect-ratio when both width and height are missing", () => {
      render(<CloudinaryImage alt="Test image" publicId="test-image" />);

      const img = screen.getByAltText("Test image") as HTMLImageElement;

      // aspectRatio should be undefined when both are missing
      expect(img.style.aspectRatio).toBe("");
    });
  });

  describe("lazy loading attributes", () => {
    it("should include loading='lazy' attribute", () => {
      render(
        <CloudinaryImage
          alt="Test image"
          publicId="test-image"
          width={1200}
          height={630}
        />,
      );

      const img = screen.getByAltText("Test image") as HTMLImageElement;

      expect(img.getAttribute("loading")).toBe("lazy");
    });

    it("should include decoding='async' attribute", () => {
      render(
        <CloudinaryImage
          alt="Test image"
          publicId="test-image"
          width={1200}
          height={630}
        />,
      );

      const img = screen.getByAltText("Test image") as HTMLImageElement;

      expect(img.getAttribute("decoding")).toBe("async");
    });
  });

  describe("explicit dimensions", () => {
    it("should set width and height attributes when provided", () => {
      render(
        <CloudinaryImage
          alt="Test image"
          publicId="test-image"
          width={1200}
          height={630}
        />,
      );

      const img = screen.getByAltText("Test image") as HTMLImageElement;

      expect(img.getAttribute("width")).toBe("1200");
      expect(img.getAttribute("height")).toBe("630");
    });

    it("should handle numeric dimensions correctly", () => {
      render(
        <CloudinaryImage
          alt="Test image"
          publicId="test-image"
          width={800}
          height={600}
        />,
      );

      const img = screen.getByAltText("Test image") as HTMLImageElement;

      expect(img.getAttribute("width")).toBe("800");
      expect(img.getAttribute("height")).toBe("600");
      expect(img.style.aspectRatio).toBe("800 / 600");
    });
  });

  describe("complete CLS prevention setup", () => {
    it("should have all CLS optimization attributes together", () => {
      render(
        <CloudinaryImage
          alt="Test image with CLS optimizations"
          publicId="test-image"
          width={1200}
          height={630}
        />,
      );

      const img = screen.getByAltText(
        "Test image with CLS optimizations",
      ) as HTMLImageElement;

      // Verify all CLS prevention measures are in place
      expect(img.getAttribute("width")).toBe("1200");
      expect(img.getAttribute("height")).toBe("630");
      expect(img.getAttribute("loading")).toBe("lazy");
      expect(img.getAttribute("decoding")).toBe("async");
      expect(img.style.aspectRatio).toBe("1200 / 630");
    });
  });

  describe("backward compatibility", () => {
    it("should render without errors when dimensions are not provided", () => {
      render(<CloudinaryImage alt="Test image" publicId="test-image" />);

      const img = screen.getByAltText("Test image") as HTMLImageElement;

      // Should still have lazy loading attributes
      expect(img.getAttribute("loading")).toBe("lazy");
      expect(img.getAttribute("decoding")).toBe("async");
      // But no explicit dimensions
      expect(img.getAttribute("width")).toBeNull();
      expect(img.getAttribute("height")).toBeNull();
    });
  });
});
