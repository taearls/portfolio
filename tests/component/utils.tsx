import type { RenderResult } from "@testing-library/react";
import type { ReactNode } from "react";

import { render } from "@testing-library/react";

import ThemeContext from "@/state/contexts/ThemeContext.tsx";
import {
  setupDocumentElementMock,
  setupMatchMediaMock,
} from "../unit/state/__mocks__/themeMocks.ts";

export const setColorSchemeForTest = (colorScheme: "light" | "dark") => {
  setupMatchMediaMock(colorScheme === "dark");
};

// Performance-optimized mock setup
export const setupWindowMocks = () => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: 1024,
    writable: true,
  });

  setupMatchMediaMock(false);
};

// Performance-optimized document mock setup
export const setupDocumentMocks = () => {
  return setupDocumentElementMock();
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
