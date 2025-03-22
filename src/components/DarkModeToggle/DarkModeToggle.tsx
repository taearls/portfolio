import { useCallback, useEffect, useState } from "react";

import RenderIf from "@/components/layout/RenderIf.tsx";
import MoonIcon from "../icons/MoonIcon.tsx";
import SunIcon from "../icons/SunIcon.tsx";
import { SocialMediaIconVariants } from "../SocialMediaIcons/SocialMediaIcons.tsx";
import SvgIcon from "../SvgIcon/SvgIcon.tsx";

export default function DarkModeToggle() {
  const prefersDarkColorScheme = window.matchMedia(
    "(prefers-color-scheme: dark)",
  );
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    prefersDarkColorScheme.matches,
  );

  const handleToggle = useCallback(
    () => setIsDarkMode((prevState) => !prevState),
    [setIsDarkMode],
  );

  useEffect(() => {
    const rootNode = (
      document.getRootNode() as Node & { documentElement: HTMLElement }
    ).documentElement as HTMLElement;

    if (isDarkMode) {
      rootNode.classList.remove("light-theme");
      rootNode.classList.add("dark-theme");
    } else {
      rootNode.classList.remove("dark-theme");
      rootNode.classList.add("light-theme");
    }
  }, [isDarkMode]);

  return (
    <button onClick={handleToggle}>
      <RenderIf condition={isDarkMode} fallback={<MoonIcon />}>
        <SunIcon />
      </RenderIf>
    </button>
  );
}
