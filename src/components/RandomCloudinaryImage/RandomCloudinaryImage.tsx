import CloudinaryImage from "@/components/CloudinaryImage/CloudinaryImage.tsx";
import { capitalizeText } from "@/util/styling/styling.utils.ts";
import { getRandomNumberInRange } from "@/util/utils.ts";

// TODO: implement cache
// const PHOTO_GROUP_CACHE = Object.entries(IMAGE_GROUPS).map(
//   ([groupName, count]) => {
//     return {
//       [groupName]: {
//         usedCount: 0,
//         max: count,
//       },
//     };
//   },
// );

// let PHOTO_GROUP_CACHE: Record<string, number> = Object.assign(
//   {},
//   ...Object.keys(IMAGE_GROUPS).map((groupName) => ({
//     [groupName]: 0,
//   })),
// );

// const getOneOfLowestGroup = (imageGroups: Record<string, number>) => {
//   const values = Object.values(imageGroups);
//   const lowestCount = Math.min(...values);

//   const [result] = Object.entries(imageGroups).find(([groupName, count]) => {
//     const max = IMAGE_GROUPS[groupName];

//     return count === lowestCount && count < max;
//   });

//   return result;
// };

export type RandomCloudinaryImageProps = {
  imageGroups: Record<string, number>;
  groupNumber: number;
  publicIdPrefix?: string;
};

export default function RandomCloudinaryImage({
  imageGroups,
  groupNumber,
  publicIdPrefix = `Sanjana Quarantine Photoshoot`,
}: RandomCloudinaryImageProps) {
  const imageGroup = Object.keys(imageGroups)[groupNumber];
  const photoId = getRandomNumberInRange({ max: imageGroups[imageGroup] });
  const publicId = `${publicIdPrefix ? publicIdPrefix + "/" : ""}${imageGroup}/${photoId}`;

  return (
    <CloudinaryImage
      publicId={publicId}
      alt={`${capitalizeText(imageGroup)} Photo from ${capitalizeText(publicIdPrefix)}`}
    />
  );
}
