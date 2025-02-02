import { fill } from "@cloudinary/url-gen/actions/resize";

import { CLOUDINARY_INSTANCE } from "@/util/constants/constants.ts";

export type CloudinaryImageProps = {
  alt: string;
  publicId: string;
  width?: number;
  height?: number;
};

export default function CloudinaryImage({
  alt,
  publicId,
  width = 500,
  height = 500,
}: CloudinaryImageProps) {
  const img = CLOUDINARY_INSTANCE.image(publicId);

  img.resize(fill().width(width).height(height));

  return (
    <img
      src={img.toURL()}
      alt={alt}
      style={{ height: "auto", maxWidth: "var(--max-width-mobile)", width }}
    />
  );
}
