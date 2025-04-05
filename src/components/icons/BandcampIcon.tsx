import { SVG_ICON_VARIANTS } from "@/types/svg.ts";
import SvgIcon from "../SvgIcon/SvgIcon.tsx";

export type BandcampIconProps = {
  description?: string;
  title?: string;
};

const DEFAULT_PROP_VALUES: BandcampIconProps = {
  description:
    "Icon inside a link indicating that the user will visit Bandcamp in a separate tab or window if they click or tap the link.",
  title: "Link to Bandcamp",
};

export default function BandcampIcon({
  title = DEFAULT_PROP_VALUES.title,
  description = DEFAULT_PROP_VALUES.description,
}: BandcampIconProps) {
  return (
    <SvgIcon
      name={SVG_ICON_VARIANTS.BANDCAMP}
      title={title}
      description={description}
    />
  );
}
