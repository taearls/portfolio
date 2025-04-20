import type { Transformation } from "@cloudinary/url-gen/index";

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
  width?: number;
  height?: number;
  transformation?: Transformation | string;
  showCaption?: boolean;
  fileFormat?: CloudinaryImageFileFormat;
};

export default function CloudinaryImage({
  alt,
  publicId,
  directory,
  width = 500,
  height = 500,
  fileFormat = "webp",
  transformation,
  showCaption = false,
}: CloudinaryImageProps) {
  const img = CLOUDINARY_INSTANCE.image(
    `${directory != null ? directory + "/" : ""}${publicId}`,
  );

  if (transformation) {
    img.addTransformation(transformation);
  } else {
    img.resize(fill().width(width).height(height));
  }

  img.format(fileFormat);

  const style = useMemo(
    () => ({ height: "auto", maxWidth: "var(--max-width-mobile)", width }),
    [width],
  );

  const imgElement = <img src={img.toURL()} alt={alt} style={style} />;

  if (showCaption) {
    return (
      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN}>
        {imgElement}
      </FlexContainer>
    );
  }

  return imgElement;
}
