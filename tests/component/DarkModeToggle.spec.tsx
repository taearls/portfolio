import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle.tsx";
import { renderWithProviders, setColorSchemeForTest } from "./utils.tsx";

const lightModeStyle = { colorScheme: "light" };

describe("<DarkModeToggle />", () => {
  it("will show a sun icon in dark mode", async () => {
    setColorSchemeForTest("dark");
    const component = renderWithProviders(<DarkModeToggle visible />);

    const isDarkModeIconRendered =
      (await component.findAllByTestId("sun-icon")).length === 1;

    expect(isDarkModeIconRendered).toBeTruthy();
  });
  it("will show a moon icon in light mode", async () => {
    setColorSchemeForTest("light");

    const component = renderWithProviders(
      <div style={lightModeStyle}>
        <DarkModeToggle visible />
      </div>,
    );

    const isLightModeIconRendered =
      (await component.findAllByTestId("moon-icon")).length === 1;

    expect(isLightModeIconRendered).toBeTruthy();
  });
});
