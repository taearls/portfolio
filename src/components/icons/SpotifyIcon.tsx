import { SVG_ICON_VARIANTS } from "@/types/svg.ts";
import SvgIcon from "../SvgIcon/SvgIcon.tsx";

export type SpotifyIconProps = {
  description?: string;
  title?: string;
};

const DEFAULT_PROP_VALUES: SpotifyIconProps = {
  description:
    "Icon inside a link indicating that the user will visit Spotify in a separate tab or window if they click or tap the link.",
  title: "Link to Spotify",
};

export default function SpotifyIcon({
  title = DEFAULT_PROP_VALUES.title,
  description = DEFAULT_PROP_VALUES.description,
}: SpotifyIconProps) {
  return (
    <SvgIcon
      name={SVG_ICON_VARIANTS.SPOTIFY}
      title={title}
      description={description}
    />
  );
}
