import { SVG_ICON_VARIANTS } from "@/types/svg.ts";
import SvgIcon from "../SvgIcon/SvgIcon.tsx";

export default function MoonIcon() {
  return (
    <SvgIcon
      name={SVG_ICON_VARIANTS.MOON}
      accent={false}
      id="moon-icon"
      data-testid="moon-icon"
      color=""
      hoverOpacity
      height="24"
      width="24"
    />
  );
}
