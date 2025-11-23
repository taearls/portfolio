import type { Transformation } from "@cloudinary/url-gen/index";
import type { CSSProperties } from "react";

import { fill } from "@cloudinary/url-gen/actions/resize";

import { FlexFlowCSSValue } from "@/types/layout.ts";
import { CLOUDINARY_INSTANCE } from "@/util/constants/constants.ts";
import FlexContainer from "../layout/containers/FlexContainer/FlexContainer.tsx";

export type CloudinaryImageFileFormat = "jpg" | "png" | "webp";

export type CloudinaryImageProps = {
  alt: string;
  publicId: string;
  directory?: string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  maxWidth?: CSSProperties["maxWidth"];
  transformation?: Transformation | string;
  showCaption?: boolean;
  fileFormat?: CloudinaryImageFileFormat;
  /**
   * Loading strategy for the image.
   * - "lazy": Defers loading until image is near viewport (default, good for below-fold images)
   * - "eager": Loads immediately (use for above-fold/LCP images)
   */
  loading?: "lazy" | "eager";
  /**
   * Fetch priority hint for the browser.
   * - "high": Prioritize this resource (use for LCP images)
   * - "low": Deprioritize this resource
   * - "auto": Let browser decide (default)
   */
  fetchPriority?: "high" | "low" | "auto";
};

export default function CloudinaryImage({
  alt,
  publicId,
  directory,
  width,
  height,
  fileFormat = "webp",
  transformation,
  maxWidth,
  showCaption = false,
  loading = "lazy",
  fetchPriority = "auto",
}: CloudinaryImageProps) {
  const img = CLOUDINARY_INSTANCE.image(
    `${directory != null ? directory + "/" : ""}${publicId}`,
  );

  if (transformation) {
    img.addTransformation(transformation);
  } else if (width && height) {
    img.resize(fill().width(width).height(height));
  }

  img.format(fileFormat);

  const style: CSSProperties = {
    // Prevent CLS by preserving aspect ratio
    aspectRatio: width && height ? `${width} / ${height}` : undefined,
    height: "auto",
    maxWidth,
    width: width ?? "inherit",
  };

  const imgElement = (
    <img
      src={img.toURL()}
      alt={alt}
      style={style}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
    />
  );

  if (showCaption) {
    return (
      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN}>
        {imgElement}
      </FlexContainer>
    );
  }

  return imgElement;
}
