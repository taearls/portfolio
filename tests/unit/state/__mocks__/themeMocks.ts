import { vi } from "vitest";

// Mock utilities for theme-related tests
export const createMatchMediaMock = (matches: boolean) => ({
  addEventListener: vi.fn(),
  addListener: vi.fn(),
  dispatchEvent: vi.fn(),
  matches,
  media: "(prefers-color-scheme: dark)",
  onchange: null,
  removeEventListener: vi.fn(),
  removeListener: vi.fn(),
});

export const createDocumentElementMock = () => ({
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
  },
});

export const setupMatchMediaMock = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query) => ({
      ...createMatchMediaMock(matches),
      media: query,
    })),
    writable: true,
  });
};

export const setupDocumentElementMock = () => {
  const mockElement = createDocumentElementMock() as unknown as HTMLElement;
  Object.defineProperty(document, "documentElement", {
    value: mockElement,
    writable: true,
  });
  return mockElement;
};

export const setupThemeMocks = (prefersDark: boolean = false) => {
  const mockElement = setupDocumentElementMock();
  setupMatchMediaMock(prefersDark);
  return { mockElement };
};
