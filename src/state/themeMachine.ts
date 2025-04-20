import { createMachine } from "xstate";

export const THEME_STATE = {
  DARK: "dark",
  LIGHT: "light",
} as const satisfies Record<string, string>;

export const THEME_EVENT = {
  DARK_TO_LIGHT: "dark-to-light",
  LIGHT_TO_DARK: "light-to-dark",
} as const satisfies Record<string, string>;

export const getInitialThemeState = ():
  | typeof THEME_STATE.DARK
  | typeof THEME_STATE.LIGHT => {
  if (window.matchMedia("(prefers-color-scheme: dark)")) {
    return THEME_STATE.DARK;
  }

  return THEME_STATE.LIGHT;
};

const onLightToDark = () => {
  const rootNode = (
    document.getRootNode() as Node & { documentElement: HTMLElement }
  ).documentElement as HTMLElement;

  rootNode.classList.remove("light-theme");
  rootNode.classList.add("dark-theme");
};

const onDarkToLight = () => {
  const rootNode = (
    document.getRootNode() as Node & { documentElement: HTMLElement }
  ).documentElement as HTMLElement;

  rootNode.classList.remove("dark-theme");
  rootNode.classList.add("light-theme");
};

export const themeMachine = createMachine({
  id: "theme",
  initial: getInitialThemeState(),
  states: {
    [THEME_STATE.DARK]: {
      on: {
        [THEME_EVENT.DARK_TO_LIGHT]: {
          actions: onDarkToLight,
          target: THEME_STATE.LIGHT,
        },
      },
    },
    [THEME_STATE.LIGHT]: {
      on: {
        [THEME_EVENT.LIGHT_TO_DARK]: {
          actions: onLightToDark,
          target: THEME_STATE.DARK,
        },
      },
    },
  },
});
