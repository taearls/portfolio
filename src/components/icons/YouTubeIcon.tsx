import { SVG_ICON_VARIANTS } from "@/types/svg.ts";
import SvgIcon from "../SvgIcon/SvgIcon.tsx";

export type YouTubeIconProps = {
  description?: string;
  title?: string;
};

const DEFAULT_PROP_VALUES: YouTubeIconProps = {
  description:
    "Icon inside a link indicating that the user will visit YouTube in a separate tab or window if they click or tap the link.",
  title: "Link to YouTube",
};

export default function YouTubeIcon({
  title = DEFAULT_PROP_VALUES.title,
  description = DEFAULT_PROP_VALUES.description,
}: YouTubeIconProps) {
  return (
    <SvgIcon
      name={SVG_ICON_VARIANTS.YOUTUBE}
      title={title}
      description={description}
    />
  );
}
