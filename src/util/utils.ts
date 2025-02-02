import { WebProjectAnalytics } from "@/components/WebProject/WebProject.tsx";
import { TextAlignmentType } from "@/types/layout.ts";

export const cloneDeep = <T extends object>(item: T) =>
  JSON.parse(JSON.stringify(item));

export const getTextAlignmentClass = (alignment: TextAlignmentType): string => {
  switch (alignment) {
    case "left": {
      return "text-left";
    }
    case "center": {
      return "text-center";
    }
    case "right":
      return "text-right";
    default:
      return "text-center";
  }
};

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

export const getLinkWithAnalytics = (
  href: string,
  analytics?: WebProjectAnalytics,
): string => {
  let urlString = href;

  if (analytics != null) {
    const { campaign, medium, source } = analytics;
    urlString += `?utm_campaign=${campaign}&utm_medium=${medium}&source=${source}`;
  }

  return urlString;
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};

/**
 * Helper function to safely convert a type T into an Array<T>
 * @param item - the item to convert into an array
 * @returns - an array of type Array<T>
 */
export const intoArray = <T>(item: T | Array<T> | undefined): Array<T> => {
  if (!item) {
    return [] as Array<T>;
  }

  return Array.isArray(item) ? item : [item];
};

export const getRandomNumberInRange = ({
  max,
  min = 1,
}: {
  max: number;
  min?: number;
}): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
