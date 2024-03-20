export const getCloudinarySrc = (
  publicId: string,
  extension: string,
  transformations: Array<string>,
): string => {
  if (transformations.length === 0) {
    return `https://res.cloudinary.com/taearls/image/upload/${publicId}.${extension}`;
  }
  const transformationString = transformations.join(",");
  return `https://res.cloudinary.com/taearls/image/upload/${transformationString}/v1/${publicId}.${extension}`;
};
