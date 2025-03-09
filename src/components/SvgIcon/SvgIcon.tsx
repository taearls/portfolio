// eslint-disable-next-line import/no-unresolved
import ids from "virtual:svg-icons-names";

export type SvgIconProps = {
  name: string;
  dir?: string;
  color?: string;
};

const defaultColor = window
  .getComputedStyle(document.body)
  .getPropertyValue("--accent-color");

export default function SvgIcon({ name, dir = ".", color = "" }: SvgIconProps) {
  const symbolId = `#${name}`;

  console.log({ defaultColor });
  console.log({ ids });

  return (
    <svg aria-hidden="true">
      <use href={symbolId} fill={defaultColor} />
    </svg>
  );
}
