import type { CloudinaryImageProps } from "@/components/CloudinaryImage/CloudinaryImage.tsx";

import CloudinaryImage from "@/components/CloudinaryImage/CloudinaryImage.tsx";

export type WebProjectImageProps = CloudinaryImageProps;

export default function WebProjectImage({
  alt,
  publicId,
  width,
  height,
}: WebProjectImageProps) {
  return (
    <CloudinaryImage
      alt={alt}
      publicId={publicId}
      width={width}
      height={height}
    />
  );
}
