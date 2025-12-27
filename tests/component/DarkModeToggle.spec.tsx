import "@testing-library/jest-dom/vitest";

import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle.tsx";
import { THEME_STATES } from "@/state/machines/themeMachine.ts";
import { renderWithProviders } from "./utils.tsx";

describe("<DarkModeToggle />", () => {
  it("has aria-label 'Switch to light mode' in dark mode", async () => {
    const component = renderWithProviders(<DarkModeToggle visible />, {
      initialState: { theme: THEME_STATES.DARK },
    });

    const button = await component.findByRole("button");
    expect(button).toHaveAttribute("aria-label", "Switch to light mode");
  });

  it("has aria-label 'Switch to dark mode' in light mode", async () => {
    const component = renderWithProviders(<DarkModeToggle visible />, {
      initialState: { theme: THEME_STATES.LIGHT },
    });

    const button = await component.findByRole("button");
    expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
  });

  it("will show a sun icon in dark mode", async () => {
    const component = renderWithProviders(<DarkModeToggle visible />, {
      initialState: { theme: THEME_STATES.DARK },
    });

    const isDarkModeIconRendered =
      (await component.findAllByTestId("sun-icon")).length === 1;

    expect(isDarkModeIconRendered).toBeTruthy();
  });

  it("will show a moon icon in light mode", async () => {
    const component = renderWithProviders(<DarkModeToggle visible />, {
      initialState: { theme: THEME_STATES.LIGHT },
    });

    const isLightModeIconRendered =
      (await component.findAllByTestId("moon-icon")).length === 1;

    expect(isLightModeIconRendered).toBeTruthy();
  });
});
