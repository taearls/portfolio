import type { RenderResult } from "@testing-library/react";
import type { ReactNode } from "react";

import { render } from "@testing-library/react";

import ThemeContext from "@/state/contexts/ThemeContext.tsx";

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

// Performance-optimized mock setup
export const setupWindowMocks = () => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: 1024,
    writable: true,
  });

  Object.defineProperty(window, "matchMedia", {
    value: vi.fn().mockImplementation((query) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
    writable: true,
  });
};

// Performance-optimized document mock setup
export const setupDocumentMocks = () => {
  const mockDocumentElement = {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
    },
  } as unknown as HTMLElement;

  Object.defineProperty(document, "documentElement", {
    value: mockDocumentElement,
    writable: true,
  });

  return mockDocumentElement;
};

// Cached DOM element creation for performance
const createMockElement = (
  tag: string,
  id: string,
  properties: Record<string, unknown> = {},
) => {
  const element = document.createElement(tag);
  element.id = id;

  Object.entries(properties).forEach(([key, value]) => {
    Object.defineProperty(element, key, {
      value,
      writable: false,
    });
  });

  return element;
};

// Performance-optimized DOM setup
export const setupMockDOM = () => {
  const mockPageContainer = createMockElement("div", "page-container", {
    style: { marginTop: "0px" },
  });

  const mockNavigationBar = createMockElement("nav", "navigation-bar", {
    offsetHeight: 60,
  });

  document.body.appendChild(mockPageContainer);
  document.body.appendChild(mockNavigationBar);

  return { mockNavigationBar, mockPageContainer };
};

// Performance-optimized cleanup
export const cleanupMockDOM = (elements: Array<HTMLElement>) => {
  elements.forEach((element) => {
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }
  });
};

// Shared render function with common providers
export const renderWithProviders = (
  ui: ReactNode,
  options?: {
    route?: string;
    theme?: "light" | "dark";
  },
): RenderResult => {
  const { route = "/", theme = "light" } = options || {};

  setColorSchemeForTest(theme);

  return render(<ThemeContext.Provider>{ui}</ThemeContext.Provider>);
};
