import type { SvgIconVariant } from "@/types/svg.ts";

import { mergeClasses } from "@/util/styling/styling.utils.ts";
import RenderIf from "../layout/RenderIf.tsx";

export type SvgIconProps = {
  name: SvgIconVariant;
  id?: string;
  "data-testid"?: string;
  accent?: boolean;
  color?: string;
  title?: string;
  hoverOpacity?: boolean;
  width?: string;
  height?: string;
  description?: string;
};

const defaultColor = window
  .getComputedStyle(document.body)
  .getPropertyValue("--accent-color");

export default function SvgIcon({
  id,
  name,
  "data-testid": testId,
  accent = true,
  color = defaultColor,
  width,
  title,
  description,
  height,
  hoverOpacity = false,
}: SvgIconProps) {
  const symbolId = `/icons/sprite.svg#${name}`;

  return (
    <svg
      id={id}
      data-testid={testId}
      fill={color}
      width={width}
      height={height}
      className={mergeClasses(
        accent && "accent",
        hoverOpacity && "hover:opacity-75",
      )}
      role="presentation"
    >
      <title>{title ?? name.replace("Icon", "")}</title>
      <RenderIf condition={description != null}>
        <desc>{description}</desc>
      </RenderIf>
      <use href={symbolId}></use>
    </svg>
  );
}
