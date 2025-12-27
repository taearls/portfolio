import "@testing-library/jest-dom/vitest";

import type { RouteDataItem } from "@/constants/navigationData.tsx";

import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import NavigationBar from "@/components/navigation/NavigationBar/NavigationBar.tsx";
import ThemeContext from "@/state/contexts/ThemeContext.tsx";

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

/**
 * Helper to get the current toggle button (works regardless of current state)
 */
const getToggleButton = () => {
  return (
    screen.queryByRole("button", { name: /Open Navigation/i }) ||
    screen.queryByRole("button", { name: /Close Navigation/i })
  );
};

/**
 * Helper to ensure navigation is in closed state.
 * Clicks the close button if navigation is currently open.
 */
const ensureNavigationClosed = () => {
  const closeButton = screen.queryByRole("button", {
    name: /Close Navigation/i,
  });
  // Only click if navigation is currently open (close button visible)
  if (closeButton) {
    act(() => {
      fireEvent.click(closeButton);
    });
  }
};

/**
 * Helper to ensure navigation is in open state.
 * Clicks the open button if navigation is currently closed.
 */
const ensureNavigationOpen = () => {
  const openButton = screen.queryByRole("button", {
    name: /Open Navigation/i,
  });
  // Only click if navigation is currently closed (open button visible)
  if (openButton) {
    act(() => {
      fireEvent.click(openButton);
    });
  }
};

describe("<NavigationBar />", () => {
  describe("Navigation Toggle Functionality", () => {
    it("should toggle navigation from open to closed when close button is clicked", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Ensure navigation starts in open state
      ensureNavigationOpen();

      // Verify navigation is open (no closed class)
      expect(navigationList.className).not.toMatch(/closed/);

      // Click to close
      const closeButton = screen.getByRole("button", {
        name: /Close Navigation/i,
      });
      fireEvent.click(closeButton);

      // Verify navigation is now closed
      expect(navigationList.className).toMatch(/closed/);

      // Button should now say "Open Navigation"
      expect(
        screen.getByRole("button", { name: /Open Navigation/i }),
      ).toBeInTheDocument();
    });

    it("should toggle navigation from closed to open when open button is clicked", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Ensure navigation starts in closed state
      ensureNavigationClosed();

      // Verify navigation is closed
      expect(navigationList.className).toMatch(/closed/);

      // Click to open
      const openButton = screen.getByRole("button", {
        name: /Open Navigation/i,
      });
      fireEvent.click(openButton);

      // Verify navigation is now open (no closed class)
      expect(navigationList.className).not.toMatch(/closed/);

      // Button should now say "Close Navigation"
      expect(
        screen.getByRole("button", { name: /Close Navigation/i }),
      ).toBeInTheDocument();
    });

    it("should apply closed CSS class when navigation is closed", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Ensure navigation is closed
      ensureNavigationClosed();

      // The closed class from CSS Module should be applied
      // CSS Module mangles the class name, so we check for pattern containing "closed"
      expect(navigationList.className).toMatch(/closed/);
    });

    it("should remove closed CSS class when navigation is opened", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // First ensure navigation is closed
      ensureNavigationClosed();

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

    it("should complete a full open-close-open cycle correctly", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Start from known open state
      ensureNavigationOpen();
      expect(navigationList.className).not.toMatch(/closed/);

      // Close it
      fireEvent.click(
        screen.getByRole("button", { name: /Close Navigation/i }),
      );
      expect(navigationList.className).toMatch(/closed/);

      // Open it again
      fireEvent.click(screen.getByRole("button", { name: /Open Navigation/i }));
      expect(navigationList.className).not.toMatch(/closed/);

      // Close it again
      fireEvent.click(
        screen.getByRole("button", { name: /Close Navigation/i }),
      );
      expect(navigationList.className).toMatch(/closed/);
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
      const toggleButton = getToggleButton();

      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute("aria-label");
    });

    it("should update aria-label when toggle state changes", () => {
      renderNavigationBar();

      // Start from known open state
      ensureNavigationOpen();

      // Verify we have close button (nav is open)
      const closeButton = screen.getByRole("button", {
        name: /Close Navigation/i,
      });
      expect(closeButton).toHaveAttribute("aria-label", "Close Navigation");

      // Click to toggle
      fireEvent.click(closeButton);

      // Verify we now have open button (nav is closed)
      const openButton = screen.getByRole("button", {
        name: /Open Navigation/i,
      });
      expect(openButton).toHaveAttribute("aria-label", "Open Navigation");
    });
  });

  describe("CSS Module Integration", () => {
    it("should use CSS Module closed class for hiding navigation (not Tailwind hidden)", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Ensure navigation is closed
      ensureNavigationClosed();

      // The class should contain "closed" (CSS Module pattern)
      // It should NOT just be "hidden" (Tailwind utility - which has specificity issues)
      expect(navigationList.className).toMatch(/closed/);
      // Verify it's a CSS Module class (contains hash suffix like _closed_abc123)
      expect(navigationList.className).toMatch(/_closed_[a-z0-9]+/i);
    });
  });

  describe("Auto-close on Link Click (Mobile UX)", () => {
    it("should close navigation when a link is clicked while navigation is open", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Ensure navigation starts in open state
      ensureNavigationOpen();

      // Verify navigation is open
      expect(navigationList.className).not.toMatch(/closed/);

      // Click a navigation link
      const codeLink = screen.getByText("Code");
      fireEvent.click(codeLink);

      // Navigation should now be closed
      expect(navigationList.className).toMatch(/closed/);
    });

    it("should not error when clicking a link while navigation is already closed", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Ensure navigation is closed
      ensureNavigationClosed();

      // Verify navigation is closed
      expect(navigationList.className).toMatch(/closed/);

      // Click a navigation link - should not throw or cause issues
      const contactLink = screen.getByText("Contact");
      expect(() => fireEvent.click(contactLink)).not.toThrow();

      // Navigation should remain closed
      expect(navigationList.className).toMatch(/closed/);
    });

    it("should close navigation regardless of which link is clicked", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Test with Home link
      ensureNavigationOpen();
      expect(navigationList.className).not.toMatch(/closed/);
      fireEvent.click(screen.getByText("Home"));
      expect(navigationList.className).toMatch(/closed/);

      // Test with Code link
      ensureNavigationOpen();
      expect(navigationList.className).not.toMatch(/closed/);
      fireEvent.click(screen.getByText("Code"));
      expect(navigationList.className).toMatch(/closed/);

      // Test with Contact link
      ensureNavigationOpen();
      expect(navigationList.className).not.toMatch(/closed/);
      fireEvent.click(screen.getByText("Contact"));
      expect(navigationList.className).toMatch(/closed/);
    });
  });

  describe("Auto-close on Click Outside (Mobile UX)", () => {
    it("should close navigation when clicking outside while navigation is open", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Ensure navigation starts in open state
      ensureNavigationOpen();

      // Verify navigation is open
      expect(navigationList.className).not.toMatch(/closed/);

      // Simulate click outside the nav (on the document body)
      act(() => {
        fireEvent.click(document.body);
      });

      // Navigation should now be closed
      expect(navigationList.className).toMatch(/closed/);
    });

    it("should not close navigation when clicking inside the nav", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Ensure navigation starts in open state
      ensureNavigationOpen();

      // Verify navigation is open
      expect(navigationList.className).not.toMatch(/closed/);

      // Click inside the navigation (on the list itself)
      act(() => {
        fireEvent.click(navigationList);
      });

      // Navigation should still be open
      expect(navigationList.className).not.toMatch(/closed/);
    });

    it("should not error when clicking outside while navigation is already closed", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Ensure navigation is closed
      ensureNavigationClosed();

      // Verify navigation is closed
      expect(navigationList.className).toMatch(/closed/);

      // Click outside - should not throw or cause issues
      expect(() => {
        act(() => {
          fireEvent.click(document.body);
        });
      }).not.toThrow();

      // Navigation should remain closed
      expect(navigationList.className).toMatch(/closed/);
    });

    it("should not close navigation when clicking the toggle button", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("menu");

      // Ensure navigation is closed first
      ensureNavigationClosed();

      // Get the toggle button and click it to open
      const toggleButton = getToggleButton();
      act(() => {
        fireEvent.click(toggleButton!);
      });

      // Navigation should be open
      expect(navigationList.className).not.toMatch(/closed/);

      // The toggle button click should NOT trigger click-outside
      // (since the button is inside the nav)
    });
  });
});
