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
  // TODO: see if there's a React-specific api to make this more streamlined
  return (
    <img
      src={getCloudinarySrc(publicId, extension, transformations)}
      alt={alt}
    />
  );
}
