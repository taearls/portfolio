import type { Transformation } from "@cloudinary/url-gen/index";
import type { CSSProperties } from "react";

import { fill } from "@cloudinary/url-gen/actions/resize";
import { useMemo } from "react";

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

  const style = useMemo(
    () => ({
      height: "auto",
      maxWidth,
      width: width ?? "inherit",
    }),
    [width, maxWidth],
  );

  const imgElement = (
    <img
      src={img.toURL()}
      alt={alt}
      style={style}
      width={width}
      height={height}
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
