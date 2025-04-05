import { SVG_ICON_VARIANTS } from "@/types/svg.ts";
import SvgIcon from "../SvgIcon/SvgIcon.tsx";

export type GithubIconProps = {
  description?: string;
  title?: string;
};

const DEFAULT_PROP_VALUES: GithubIconProps = {
  description:
    "Icon inside a link indicating that the user will visit Github in a separate tab or window if they click or tap the link.",
  title: "Link to Github",
};

export default function GithubIcon({
  title = DEFAULT_PROP_VALUES.title,
  description = DEFAULT_PROP_VALUES.description,
}: GithubIconProps) {
  return (
    <SvgIcon
      name={SVG_ICON_VARIANTS.GITHUB}
      title={title}
      description={description}
    />
  );
}
