import { WebProjectAnalytics } from "@/components/WebProject/WebProject";
import { TextAlignment } from "@/components/layout/headings";

export const cloneDeep = <T extends object>(item: T) =>
  JSON.parse(JSON.stringify(item));

export const getTextAlignmentClass = (alignment: TextAlignment): string => {
  switch (alignment) {
    case "left": {
      return "text-left";
    }
    case "center": {
      return "text-center";
    }
    case "right":
      return "text-right";
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
