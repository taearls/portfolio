import { createActorContext } from "@xstate/react";

import { themeMachine } from "../machines/themeMachine.ts";

const ThemeContext = createActorContext(themeMachine);

export default ThemeContext;
