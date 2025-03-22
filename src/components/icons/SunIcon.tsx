import { SVG_ICON_VARIANTS } from "@/types/svg.ts";
import SvgIcon from "../SvgIcon/SvgIcon.tsx";

export default function SunIcon() {
  return (
    <SvgIcon
      name={SVG_ICON_VARIANTS.SUN}
      accent={false}
      color=""
      hoverOpacity
      height="24"
      width="24"
    />
  );
}
