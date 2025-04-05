import { SVG_ICON_VARIANTS } from "@/types/svg.ts";
import SvgIcon from "../SvgIcon/SvgIcon.tsx";

export type ExternalLinkIconProps = {
  description?: string;
  title?: string;
};

const DEFAULT_PROP_VALUES: ExternalLinkIconProps = {
  description:
    "Icon inside a link indicating that the user will visit an external website in a separate tab or window if they click or tap the link.",
  title: "External Link",
};

export default function ExternalLinkIcon({
  description = DEFAULT_PROP_VALUES.description,
  title = DEFAULT_PROP_VALUES.title,
}: ExternalLinkIconProps) {
  return (
    <SvgIcon
      name={SVG_ICON_VARIANTS.EXTERNAL_LINK}
      accent={false}
      title={title}
      description={description}
      width="18"
      height="18"
    />
  );
}
