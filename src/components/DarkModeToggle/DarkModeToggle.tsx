import { useCallback } from "react";

import ThemeContext from "@/state/contexts/ThemeContext.tsx";
import { THEME_EVENT, THEME_STATES } from "@/state/machines/themeMachine.ts";
import { mergeClasses } from "@/util/styling/styling.utils.ts";
import MoonIcon from "../icons/MoonIcon.tsx";
import SunIcon from "../icons/SunIcon.tsx";

export type DarkModeToggleProps = {
  visible: boolean;
};

export default function DarkModeToggle({ visible }: DarkModeToggleProps) {
  const themeState = ThemeContext.useSelector((state) => state.value);
  const actorRef = ThemeContext.useActorRef();

  // NOTE: useCallback kept for XState actor reference stability
  const updateTheme = useCallback(
    () => actorRef.send({ type: THEME_EVENT.TOGGLE }),
    [actorRef],
  );

  return (
    <button
      onClick={updateTheme}
      className={mergeClasses(!visible && "hidden")}
    >
      <span hidden={themeState === THEME_STATES.DARK}>
        <MoonIcon />
      </span>
      <span hidden={themeState === THEME_STATES.LIGHT}>
        <SunIcon />
      </span>
      {/* <RenderIf
        condition={state.value === THEME_STATES.DARK}
        fallback={<MoonIcon />}
      >
        <SunIcon />
      </RenderIf> */}
    </button>
  );
}
