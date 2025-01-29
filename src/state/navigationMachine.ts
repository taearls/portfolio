import { createMachine } from "xstate";

export const checkNavHeight = () => {
  const pageContainer = document.getElementById("page-container");
  const navigationBar = document.getElementById("navigation-bar");

  if (pageContainer && navigationBar) {
    pageContainer.style.marginTop =
      navigationBar.offsetHeight.toString() + "px";
  }
};

const onToggleAction = () =>
  setTimeout(() => {
    checkNavHeight();
  }, 0);

export const NAVIGATION_STATE = {
  CLOSED: "closed",
  OPEN: "open",
} as const satisfies Record<string, string>;

export const NAVIGATION_EVENT = {
  TOGGLE: "toggle",
} as const satisfies Record<string, string>;

export const navigationMachine = createMachine({
  id: "navigation",
  initial: NAVIGATION_STATE.CLOSED,
  states: {
    [NAVIGATION_STATE.CLOSED]: {
      on: {
        [NAVIGATION_EVENT.TOGGLE]: {
          actions: () => {
            onToggleAction();
          },
          target: NAVIGATION_STATE.OPEN,
        },
      },
    },
    [NAVIGATION_STATE.OPEN]: {
      on: {
        [NAVIGATION_EVENT.TOGGLE]: {
          actions: () => {
            onToggleAction();
          },
          target: NAVIGATION_STATE.CLOSED,
        },
      },
    },
  },
});
