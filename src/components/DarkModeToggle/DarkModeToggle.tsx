import { useMachine } from "@xstate/react";
import { useCallback } from "react";

import RenderIf from "@/components/layout/RenderIf.tsx";
import {
  THEME_EVENT,
  THEME_STATE,
  themeMachine,
} from "@/state/themeMachine.ts";
import MoonIcon from "../icons/MoonIcon.tsx";
import SunIcon from "../icons/SunIcon.tsx";

export default function DarkModeToggle() {
  const [state, send] = useMachine(themeMachine);

  const updateTheme = useCallback(() => {
    if (state.value === THEME_STATE.DARK) {
      send({ type: THEME_EVENT.DARK_TO_LIGHT });
    } else if (state.value === THEME_STATE.LIGHT) {
      send({ type: THEME_EVENT.LIGHT_TO_DARK });
    }
  }, [state]);

  return (
    <button onClick={updateTheme}>
      <RenderIf
        condition={state.value === THEME_STATE.DARK}
        fallback={<MoonIcon />}
      >
        <SunIcon />
      </RenderIf>
    </button>
  );
}
