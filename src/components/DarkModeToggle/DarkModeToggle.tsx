import { memo, useCallback } from "react";

import ThemeContext from "@/state/contexts/ThemeContext.tsx";
import { THEME_EVENT, THEME_STATES } from "@/state/machines/themeMachine.ts";
import { mergeClasses } from "@/util/styling/styling.utils.ts";
import MoonIcon from "../icons/MoonIcon.tsx";
import SunIcon from "../icons/SunIcon.tsx";

export type DarkModeToggleProps = {
  visible: boolean;
};

export default memo(function DarkModeToggle({ visible }: DarkModeToggleProps) {
  const themeState = ThemeContext.useSelector((state) => state.value);
  const actorRef = ThemeContext.useActorRef();

  const updateTheme = useCallback(
    () => actorRef.send({ type: THEME_EVENT.TOGGLE }),
    [actorRef],
  );

  return (
    <button
      onClick={updateTheme}
      className={mergeClasses(!visible && "hidden")}
    >
      <span hidden={themeState === THEME_STATES.LIGHT}>
        <MoonIcon />
      </span>
      <span hidden={themeState === THEME_STATES.DARK}>
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
});
