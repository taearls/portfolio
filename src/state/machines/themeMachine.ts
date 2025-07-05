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
  // Check if the user prefers dark mode
  if (typeof window !== "undefined" && window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (mediaQuery && typeof mediaQuery.matches === "boolean") {
      return mediaQuery.matches ? THEME_STATES.DARK : THEME_STATES.LIGHT;
    }
  }
  // Fallback to light theme if matchMedia is not available
  return THEME_STATES.LIGHT;
};

const setInitialTheme = () => {
  const rootNode = (
    document.getRootNode() as Node & { documentElement: HTMLElement }
  ).documentElement as HTMLElement | null;

  const initialTheme = getInitialThemeState();
  if (initialTheme === THEME_STATES.DARK) {
    rootNode?.classList.remove("light-theme");
    rootNode?.classList.add("dark-theme");
  } else {
    rootNode?.classList.remove("dark-theme");
    rootNode?.classList.add("light-theme");
  }
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
  entry: setInitialTheme,
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
