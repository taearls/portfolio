// // eslint-disable-next-line import/no-unresolved
// import ids from "virtual:svg-icons-names";

import { mergeClasses } from "@/util/styling/styling.utils.ts";
import { SocialMediaIconVariants } from "../SocialMediaIcons/SocialMediaIcons";

export type SvgIconProps = {
  name: string;
  accent?: boolean;
  color?: string;
  hoverOpacity?: boolean;
};

const defaultColor = window
  .getComputedStyle(document.body)
  .getPropertyValue("--accent-color");

export default function SvgIcon({
  name,
  accent = true,
  color = defaultColor,
  hoverOpacity = false,
}: SvgIconProps) {
  const symbolId = `/icons/sprite.svg#${name}`;

  return (
    <svg
      fill={color}
      className={mergeClasses(
        accent && "accent",
        hoverOpacity && "hover:opacity-75",
      )}
    >
      <title>{name.replace("Icon", "")}</title>
      <use href={symbolId}></use>
    </svg>
  );
}
