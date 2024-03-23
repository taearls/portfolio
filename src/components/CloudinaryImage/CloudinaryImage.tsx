import Image from "next/image";
import { getCloudinarySrc } from "./util";

export type CloudinaryImageProps = {
  transformations?: Array<string>;
  alt: string;
  extension: string;
  publicId: string;
};

export default function CloudinaryImage({
  transformations = [],
  alt,
  extension,
  publicId,
}: CloudinaryImageProps) {
  return (
    <Image
      src={getCloudinarySrc(publicId, extension, transformations)}
      alt={alt}
    />
  );
}
