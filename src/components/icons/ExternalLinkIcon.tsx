import { SVG_ICON_VARIANTS } from "@/types/svg.ts";
import SvgIcon from "../SvgIcon/SvgIcon.tsx";

export type ExternalLinkIconProps = {
  title?: string;
  description?: string;
};

const DEFAULT_PROP_VALUES: ExternalLinkIconProps = {
  description:
    "Icon indicating the user will visit an external site in a separate tab or window.",
  title: "External Link",
};

export default function ExternalLinkIcon({
  title = DEFAULT_PROP_VALUES.title,
  description = DEFAULT_PROP_VALUES.description,
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
