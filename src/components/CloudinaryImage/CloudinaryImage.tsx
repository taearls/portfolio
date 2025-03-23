import type { Transformation } from "@cloudinary/url-gen/index";

import { fill } from "@cloudinary/url-gen/actions/resize";
import { useMemo } from "react";

import { CLOUDINARY_INSTANCE } from "@/util/constants/constants.ts";

export type CloudinaryImageProps = {
  alt: string;
  publicId: string;
  width?: number;
  height?: number;
  transformation?: Transformation | string;
};

export default function CloudinaryImage({
  alt,
  publicId,
  width = 500,
  height = 500,
  transformation,
}: CloudinaryImageProps) {
  const img = CLOUDINARY_INSTANCE.image(publicId);

  if (transformation) {
    img.addTransformation(transformation);
  } else {
    img.resize(fill().width(width).height(height));
  }

  const style = useMemo(
    () => ({ height: "auto", maxWidth: "var(--max-width-mobile)", width }),
    [width],
  );

  return <img src={img.toURL()} alt={alt} style={style} />;
}
