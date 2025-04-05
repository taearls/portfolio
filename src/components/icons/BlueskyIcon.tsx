import { SVG_ICON_VARIANTS } from "@/types/svg.ts";
import SvgIcon from "../SvgIcon/SvgIcon.tsx";

export type BlueskyIconProps = {
  description?: string;
  title?: string;
};

const DEFAULT_PROP_VALUES: BlueskyIconProps = {
  description:
    "Icon inside a link indicating that the user will visit Bluesky in a separate tab or window if they click or tap the link.",
  title: "Link to Bluesky",
};

export default function BlueskyIcon({
  description = DEFAULT_PROP_VALUES.description,
  title = DEFAULT_PROP_VALUES.title,
}: BlueskyIconProps) {
  return (
    <SvgIcon
      name={SVG_ICON_VARIANTS.BLUESKY}
      title={title}
      description={description}
    />
  );
}
