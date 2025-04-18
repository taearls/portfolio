import { SVG_ICON_VARIANTS } from "@/types/svg.ts";
import SvgIcon from "../SvgIcon/SvgIcon.tsx";

export type LinkedInIconProps = {
  description?: string;
  title?: string;
};

const DEFAULT_PROP_VALUES: LinkedInIconProps = {
  description:
    "Icon inside a link indicating that the user will visit LinkedIn in a separate tab or window if they click or tap the link.",
  title: "Link to LinkedIn",
};

export default function LinkedInIcon({
  title = DEFAULT_PROP_VALUES.title,
  description = DEFAULT_PROP_VALUES.description,
}: LinkedInIconProps) {
  return (
    <SvgIcon
      name={SVG_ICON_VARIANTS.LINKEDIN}
      title={title}
      description={description}
    />
  );
}
