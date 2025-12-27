import type { THEME_STATE } from "@/state/machines/themeMachine.ts";
import type { RenderResult } from "@testing-library/react";
import type { ReactNode } from "react";

import { render } from "@testing-library/react";
import { createMachine } from "xstate";

import ThemeContext from "@/state/contexts/ThemeContext.tsx";
import {
  NAVIGATION_EVENT,
  NAVIGATION_STATE,
} from "@/state/machines/navigationMachine.ts";
import { THEME_EVENT, THEME_STATES } from "@/state/machines/themeMachine.ts";

export const setColorSchemeForTest = (colorScheme: "light" | "dark") => {
  Object.defineProperty(window, "matchMedia", {
    value: vi.fn().mockImplementation((query) => {
      return {
        addEventListener: vi.fn(),
        addListener: vi.fn(), // deprecated
        dispatchEvent: vi.fn(),
        // the DarkModeToggle component checks against darkness, so setting matches this way will mock real functionality.
        matches: colorScheme === "dark",
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(), // deprecated
      };
    }),
    writable: true,
  });
};

/**
 * Initial states for XState machines used in tests.
 * All properties are optional - defaults will be used for any not specified.
 */
type InitialMachineStates = {
  theme?: THEME_STATE;
  navigation?: (typeof NAVIGATION_STATE)[keyof typeof NAVIGATION_STATE];
};

/**
 * Default initial states for all state machines.
 * Tests can override any of these by passing options to renderWithProviders.
 */
const DEFAULT_INITIAL_STATES: Required<InitialMachineStates> = {
  theme: THEME_STATES.LIGHT,
  navigation: NAVIGATION_STATE.CLOSED,
};

type RenderWithProvidersOptions = {
  initialState?: Partial<InitialMachineStates>;
};

// Create a test-friendly theme machine with a specific initial state
const createTestThemeMachine = (initialState: THEME_STATE) =>
  createMachine({
    id: "theme",
    initial: initialState,
    states: {
      [THEME_STATES.DARK]: {
        on: {
          [THEME_EVENT.TOGGLE]: {
            target: THEME_STATES.LIGHT,
          },
        },
      },
      [THEME_STATES.LIGHT]: {
        on: {
          [THEME_EVENT.TOGGLE]: {
            target: THEME_STATES.DARK,
          },
        },
      },
    },
  });

// Create a test-friendly navigation machine with a specific initial state
const createTestNavigationMachine = (
  initialState: (typeof NAVIGATION_STATE)[keyof typeof NAVIGATION_STATE],
) =>
  createMachine({
    id: "navigation",
    initial: initialState,
    states: {
      [NAVIGATION_STATE.CLOSED]: {
        on: {
          [NAVIGATION_EVENT.TOGGLE]: {
            target: NAVIGATION_STATE.OPEN,
          },
        },
      },
      [NAVIGATION_STATE.OPEN]: {
        on: {
          [NAVIGATION_EVENT.TOGGLE]: {
            target: NAVIGATION_STATE.CLOSED,
          },
        },
      },
    },
  });

export const renderWithProviders = (
  children: ReactNode,
  options?: RenderWithProvidersOptions,
): RenderResult => {
  const initialStates: Required<InitialMachineStates> = {
    ...DEFAULT_INITIAL_STATES,
    ...options?.initialState,
  };

  const themeMachine = createTestThemeMachine(initialStates.theme);
  const _navigationMachine = createTestNavigationMachine(
    initialStates.navigation,
  );

  // Note: Navigation machine is created but not currently used in provider
  // since NavigationBar uses useMachine directly. Add NavigationContext
  // wrapper here when that pattern is adopted.

  return render(
    <ThemeContext.Provider logic={themeMachine}>
      {children}
    </ThemeContext.Provider>,
  );
};
