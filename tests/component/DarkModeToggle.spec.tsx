import { render } from "@testing-library/react";

import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle.tsx";
import { setColorSchemeForTest } from "./utils.ts";

describe("<DarkModeToggle />", () => {
  it("will show a sun icon in dark mode", async () => {
    setColorSchemeForTest("dark");
    const component = render(<DarkModeToggle />);

    const isDarkModeIconRendered =
      (await component.findAllByTestId("sun-icon")).length === 1;

    expect(isDarkModeIconRendered).toBeTruthy();
  });
  it("will show a moon icon in light mode", async () => {
    setColorSchemeForTest("light");

    const component = render(
      <div style={{ colorScheme: "light" }}>
        <DarkModeToggle />
      </div>,
    );

    const isLightModeIconRendered =
      (await component.findAllByTestId("moon-icon")).length === 1;

    expect(isLightModeIconRendered).toBeTruthy();
  });
});
