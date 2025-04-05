import { SVG_ICON_VARIANTS } from "@/types/svg.ts";
import SvgIcon from "../SvgIcon/SvgIcon.tsx";

export type InstagramIconProps = {
  description?: string;
  title?: string;
};

const DEFAULT_PROP_VALUES: InstagramIconProps = {
  description:
    "Icon inside a link indicating that the user will visit Instagram in a separate tab or window if they click or tap the link.",
  title: "Link to Instagram",
};

export default function InstagramIcon({
  title = DEFAULT_PROP_VALUES.title,
  description = DEFAULT_PROP_VALUES.description,
}: InstagramIconProps) {
  return (
    <SvgIcon
      name={SVG_ICON_VARIANTS.INSTAGRAM}
      title={title}
      description={description}
    />
  );
}
