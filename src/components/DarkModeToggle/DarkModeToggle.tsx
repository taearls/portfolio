import type { THEME_STATE } from "@/state/machines/themeMachine.ts";

import { useMachine } from "@xstate/react";
import { useCallback } from "react";

import RenderIf from "@/components/layout/RenderIf.tsx";
import ThemeContext from "@/state/contexts/ThemeContext.tsx";
import {
  THEME_EVENT,
  THEME_STATES,
  themeMachine,
} from "@/state/machines/themeMachine.ts";
import MoonIcon from "../icons/MoonIcon.tsx";
import SunIcon from "../icons/SunIcon.tsx";

export default function DarkModeToggle() {
  const themeState = ThemeContext.useSelector((state) => state.value);
  const actorRef = ThemeContext.useActorRef();

  const updateTheme = useCallback(
    () => actorRef.send({ type: THEME_EVENT.TOGGLE }),
    [actorRef],
  );

  return (
    <button onClick={updateTheme}>
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
