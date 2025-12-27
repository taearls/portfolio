import { createMachine } from "xstate";

export const THEME_STATES = {
  DARK: "dark",
  LIGHT: "light",
} as const satisfies Record<string, string>;

export type THEME_STATE = typeof THEME_STATES.DARK | typeof THEME_STATES.LIGHT;

export const THEME_EVENT = {
  TOGGLE: "toggle",
} as const satisfies Record<string, string>;

export const getInitialThemeState = (): THEME_STATE => {
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return THEME_STATES.DARK;
  }

  return THEME_STATES.LIGHT;
};

const onLightToDark = () => {
  const rootNode = (
    document.getRootNode() as Node & { documentElement: HTMLElement }
  ).documentElement as HTMLElement | null;

  rootNode?.classList.remove("light-theme");
  rootNode?.classList.add("dark-theme");
};

const onDarkToLight = () => {
  const rootNode = (
    document.getRootNode() as Node & { documentElement: HTMLElement }
  ).documentElement as HTMLElement | null;

  rootNode?.classList.remove("dark-theme");
  rootNode?.classList.add("light-theme");
};

export const themeMachine = createMachine({
  id: "theme",
  initial: getInitialThemeState(),
  states: {
    [THEME_STATES.DARK]: {
      on: {
        [THEME_EVENT.TOGGLE]: {
          actions: onDarkToLight,
          target: THEME_STATES.LIGHT,
        },
      },
    },
    [THEME_STATES.LIGHT]: {
      on: {
        [THEME_EVENT.TOGGLE]: {
          actions: onLightToDark,
          target: THEME_STATES.DARK,
        },
      },
    },
  },
});
