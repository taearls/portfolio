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

const getInitialNavState = () => {
  if (window.innerWidth <= 640) {
    return NAVIGATION_STATE.CLOSED;
  }

  return NAVIGATION_STATE.OPEN;
};

export const navigationMachine = createMachine({
  id: "navigation",
  initial: getInitialNavState(),
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
