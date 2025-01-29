import { useEffect, useState } from "react";

import MoonIcon from "../icons/MoonIcon";
import SunIcon from "../icons/SunIcon";
import RenderIf from "../layout/RenderIf";

export default function DarkModeToggle() {
  const prefersDarkColorScheme = window.matchMedia(
    "(prefers-color-scheme: dark)",
  );
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    prefersDarkColorScheme.matches,
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
    <button onClick={() => setIsDarkMode(!isDarkMode)}>
      <RenderIf condition={isDarkMode} fallback={<MoonIcon />}>
        <SunIcon />
      </RenderIf>
    </button>
  );
}
