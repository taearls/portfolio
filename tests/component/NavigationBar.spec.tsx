import "@testing-library/jest-dom/vitest";

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import NavigationBar from "@/components/navigation/NavigationBar/NavigationBar.tsx";
import ThemeContext from "@/state/contexts/ThemeContext.tsx";
import type { RouteDataItem } from "@/constants/navigationData.tsx";

// Mock navigation links for testing
const mockLinks: Array<RouteDataItem> = [
  {
    ariaLabel: "Visit Home Page",
    href: "/",
    name: "Home",
  },
  {
    ariaLabel: "Visit Code Page",
    href: "/code",
    name: "Code",
  },
  {
    ariaLabel: "Visit Contact Page",
    href: "/contact",
    name: "Contact",
  },
];

const renderNavigationBar = () => {
  return render(
    <MemoryRouter>
      <ThemeContext.Provider>
        <NavigationBar links={mockLinks} />
      </ThemeContext.Provider>
    </MemoryRouter>,
  );
};

describe("<NavigationBar />", () => {
  describe("Navigation Toggle Functionality", () => {
    it("should toggle navigation visibility when toggle button is clicked", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Get the initial state of the toggle button
      // The button aria-label tells us the current action (Open = nav is closed, Close = nav is open)
      const initialButton =
        screen.queryByRole("button", { name: /Open Navigation/i }) ||
        screen.queryByRole("button", { name: /Close Navigation/i });

      expect(initialButton).toBeInTheDocument();

      const isInitiallyOpen = initialButton?.getAttribute("aria-label") === "Close Navigation";

      if (isInitiallyOpen) {
        // Navigation starts open - verify no closed class
        expect(navigationList.className).not.toMatch(/closed/);

        // Click to close
        fireEvent.click(initialButton!);

        // Should now have closed class
        expect(navigationList.className).toMatch(/closed/);

        // Button should now say "Open Navigation"
        expect(
          screen.getByRole("button", { name: /Open Navigation/i }),
        ).toBeInTheDocument();

        // Click to open again
        fireEvent.click(
          screen.getByRole("button", { name: /Open Navigation/i }),
        );

        // Should no longer have closed class
        expect(navigationList.className).not.toMatch(/closed/);
      } else {
        // Navigation starts closed - verify has closed class
        expect(navigationList.className).toMatch(/closed/);

        // Click to open
        fireEvent.click(initialButton!);

        // Should no longer have closed class
        expect(navigationList.className).not.toMatch(/closed/);

        // Button should now say "Close Navigation"
        expect(
          screen.getByRole("button", { name: /Close Navigation/i }),
        ).toBeInTheDocument();

        // Click to close again
        fireEvent.click(
          screen.getByRole("button", { name: /Close Navigation/i }),
        );

        // Should have closed class again
        expect(navigationList.className).toMatch(/closed/);
      }
    });

    it("should apply closed CSS class when navigation is closed", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Find the toggle button and get current state
      const closeButton = screen.queryByRole("button", {
        name: /Close Navigation/i,
      });

      if (closeButton) {
        // If we have a close button, navigation is open - click to close
        fireEvent.click(closeButton);
      }

      // Now navigation should be closed
      // The closed class from CSS Module should be applied
      // CSS Module mangles the class name, so we check for pattern containing "closed"
      expect(navigationList.className).toMatch(/closed/);
    });

    it("should remove closed CSS class when navigation is opened", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // First ensure navigation is closed
      const closeButton = screen.queryByRole("button", {
        name: /Close Navigation/i,
      });

      if (closeButton) {
        fireEvent.click(closeButton);
      }

      // Verify it's closed
      expect(navigationList.className).toMatch(/closed/);

      // Now open it
      const openButton = screen.getByRole("button", {
        name: /Open Navigation/i,
      });
      fireEvent.click(openButton);

      // The closed class should be removed
      expect(navigationList.className).not.toMatch(/closed/);
    });

    it("should toggle between open and closed states on multiple clicks", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Perform multiple toggles and verify state changes correctly each time
      for (let i = 0; i < 4; i++) {
        const currentButton =
          screen.queryByRole("button", { name: /Open Navigation/i }) ||
          screen.queryByRole("button", { name: /Close Navigation/i });

        expect(currentButton).toBeInTheDocument();

        const wasOpen =
          currentButton?.getAttribute("aria-label") === "Close Navigation";

        fireEvent.click(currentButton!);

        // State should have toggled
        if (wasOpen) {
          expect(navigationList.className).toMatch(/closed/);
        } else {
          expect(navigationList.className).not.toMatch(/closed/);
        }
      }
    });

    it("should render all visible navigation links", () => {
      renderNavigationBar();

      // Check that all non-hidden links are rendered
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Code")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("should have accessible toggle button with aria-label", () => {
      renderNavigationBar();

      // Should have a toggle button with appropriate aria-label
      const toggleButton =
        screen.queryByRole("button", { name: /Open Navigation/i }) ||
        screen.queryByRole("button", { name: /Close Navigation/i });

      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute("aria-label");
    });

    it("should update aria-label when toggle state changes", () => {
      renderNavigationBar();

      // Get initial button
      const initialButton =
        screen.queryByRole("button", { name: /Open Navigation/i }) ||
        screen.queryByRole("button", { name: /Close Navigation/i });

      const initialLabel = initialButton?.getAttribute("aria-label");

      // Click to toggle
      fireEvent.click(initialButton!);

      // Get new button
      const newButton =
        screen.queryByRole("button", { name: /Open Navigation/i }) ||
        screen.queryByRole("button", { name: /Close Navigation/i });

      const newLabel = newButton?.getAttribute("aria-label");

      // Labels should be different after toggle
      expect(newLabel).not.toBe(initialLabel);
    });
  });

  describe("CSS Module Integration", () => {
    it("should use CSS Module closed class for hiding navigation (not Tailwind hidden)", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Ensure navigation is closed
      const closeButton = screen.queryByRole("button", {
        name: /Close Navigation/i,
      });
      if (closeButton) {
        fireEvent.click(closeButton);
      }

      // The class should contain "closed" (CSS Module pattern)
      // It should NOT just be "hidden" (Tailwind utility - which has specificity issues)
      expect(navigationList.className).toMatch(/closed/);
      // Verify it's a CSS Module class (contains hash suffix like _closed_abc123)
      expect(navigationList.className).toMatch(/_closed_[a-z0-9]+/i);
    });
  });
});
