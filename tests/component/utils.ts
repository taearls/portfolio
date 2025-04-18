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
