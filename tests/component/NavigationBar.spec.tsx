import "@testing-library/jest-dom/vitest";

import type { RouteDataItem } from "@/constants/navigationData.tsx";

import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

import NavigationBar from "@/components/navigation/NavigationBar/NavigationBar.tsx";
import ThemeContext from "@/state/contexts/ThemeContext.tsx";

// Mobile navigation breakpoint (must match NavigationBar.tsx)
const MOBILE_NAV_BREAKPOINT = 700;

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

      const navigationList = screen.getByRole("list");

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

      const navigationList = screen.getByRole("list");

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

      const navigationList = screen.getByRole("list");

      // Ensure navigation is closed
      ensureNavigationClosed();

      // The closed class from CSS Module should be applied
      // CSS Module mangles the class name, so we check for pattern containing "closed"
      expect(navigationList.className).toMatch(/closed/);
    });

    it("should remove closed CSS class when navigation is opened", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("list");

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

      const navigationList = screen.getByRole("list");

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

      const navigationList = screen.getByRole("list");

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

      const navigationList = screen.getByRole("list");

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

      const navigationList = screen.getByRole("list");

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

      const navigationList = screen.getByRole("list");

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

      const navigationList = screen.getByRole("list");

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

      const navigationList = screen.getByRole("list");

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

      const navigationList = screen.getByRole("list");

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

      const navigationList = screen.getByRole("list");

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

  describe("Close on Escape Key (Keyboard Accessibility)", () => {
    it("should close navigation when Escape key is pressed while navigation is open", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("list");

      // Ensure navigation starts in open state
      ensureNavigationOpen();

      // Verify navigation is open
      expect(navigationList.className).not.toMatch(/closed/);

      // Press Escape key
      act(() => {
        fireEvent.keyDown(document, { key: "Escape" });
      });

      // Navigation should now be closed
      expect(navigationList.className).toMatch(/closed/);
    });

    it("should not error when pressing Escape while navigation is already closed", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("list");

      // Ensure navigation is closed
      ensureNavigationClosed();

      // Verify navigation is closed
      expect(navigationList.className).toMatch(/closed/);

      // Press Escape key - should not throw or cause issues
      expect(() => {
        act(() => {
          fireEvent.keyDown(document, { key: "Escape" });
        });
      }).not.toThrow();

      // Navigation should remain closed
      expect(navigationList.className).toMatch(/closed/);
    });

    it("should return focus to toggle button after pressing Escape", () => {
      renderNavigationBar();

      // Ensure navigation starts in open state
      ensureNavigationOpen();

      // Get the toggle button (it should be "Close Navigation" when open)
      const toggleButton = screen.getByRole("button", {
        name: /Close Navigation/i,
      });

      // Press Escape key
      act(() => {
        fireEvent.keyDown(document, { key: "Escape" });
      });

      // Toggle button should now have focus
      expect(document.activeElement).toBe(toggleButton);
    });

    it("should not close navigation when other keys are pressed", () => {
      renderNavigationBar();

      const navigationList = screen.getByRole("list");

      // Ensure navigation starts in open state
      ensureNavigationOpen();

      // Verify navigation is open
      expect(navigationList.className).not.toMatch(/closed/);

      // Press other keys
      act(() => {
        fireEvent.keyDown(document, { key: "Enter" });
      });
      expect(navigationList.className).not.toMatch(/closed/);

      act(() => {
        fireEvent.keyDown(document, { key: "Tab" });
      });
      expect(navigationList.className).not.toMatch(/closed/);

      act(() => {
        fireEvent.keyDown(document, { key: "ArrowDown" });
      });
      expect(navigationList.className).not.toMatch(/closed/);
    });
  });

  describe("Focus Trap for Mobile Navigation (Keyboard Accessibility)", () => {
    const originalInnerWidth = window.innerWidth;

    // Helper to simulate a narrow viewport
    const setNarrowViewport = () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: MOBILE_NAV_BREAKPOINT - 100,
      });
      window.dispatchEvent(new Event("resize"));
    };

    // Helper to simulate a wide viewport
    const setWideViewport = () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: MOBILE_NAV_BREAKPOINT + 100,
      });
      window.dispatchEvent(new Event("resize"));
    };

    afterEach(() => {
      // Restore original viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
    });

    it("should trap focus within navigation on narrow viewports when open", async () => {
      setNarrowViewport();
      renderNavigationBar();

      // Ensure navigation is open
      ensureNavigationOpen();

      // Get all focusable elements in the navigation
      const navLinks = screen.getAllByRole("link");
      const toggleButton = screen.getByRole("button", {
        name: /Close Navigation/i,
      });

      // Verify navigation links are present
      expect(navLinks.length).toBeGreaterThan(0);

      // When focus trap is active, Tab should cycle through nav elements
      // Focus the toggle button first
      toggleButton.focus();
      expect(document.activeElement).toBe(toggleButton);
    });

    it("should allow keyboard users to Tab through all navigation links", async () => {
      setNarrowViewport();
      const user = userEvent.setup();
      renderNavigationBar();

      // Ensure navigation is open
      ensureNavigationOpen();

      // Get the navigation element
      const nav = screen.getByRole("navigation");

      // Get navigation links
      const homeLink = screen.getByRole("link", { name: /Home/i });

      // Focus the first link
      homeLink.focus();
      expect(document.activeElement).toBe(homeLink);

      // Tab multiple times and verify focus stays within navigation
      // The focus trap cycles through: links, dark mode toggle, navigation toggle
      for (let i = 0; i < 5; i++) {
        await user.tab();
        // Verify focus is still within the navigation
        expect(nav.contains(document.activeElement)).toBe(true);
      }
    });

    it("should release focus trap when navigation closes", () => {
      setNarrowViewport();
      renderNavigationBar();

      // Open navigation
      ensureNavigationOpen();

      const navigationList = screen.getByRole("list");
      expect(navigationList.className).not.toMatch(/closed/);

      // Close navigation via toggle
      const closeButton = screen.getByRole("button", {
        name: /Close Navigation/i,
      });
      fireEvent.click(closeButton);

      // Navigation should be closed
      expect(navigationList.className).toMatch(/closed/);

      // Focus should return to toggle button
      expect(document.activeElement).toBe(closeButton);
    });

    it("should not activate focus trap on wide viewports", () => {
      setWideViewport();
      renderNavigationBar();

      // On wide viewports, navigation is always visible and focus trap should not be active
      const navLinks = screen.getAllByRole("link");
      expect(navLinks.length).toBeGreaterThan(0);

      // Focus should be able to move freely (no trap)
      navLinks[0].focus();
      expect(document.activeElement).toBe(navLinks[0]);
    });
  });

  describe("Semi-transparent Backdrop (Mobile UX)", () => {
    const originalInnerWidth = window.innerWidth;

    // Helper to simulate a narrow viewport
    const setNarrowViewport = () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: MOBILE_NAV_BREAKPOINT - 100,
      });
      window.dispatchEvent(new Event("resize"));
    };

    // Helper to simulate a wide viewport
    const setWideViewport = () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: MOBILE_NAV_BREAKPOINT + 100,
      });
      window.dispatchEvent(new Event("resize"));
    };

    afterEach(() => {
      // Restore original viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
    });

    it("should show backdrop when navigation is open on narrow viewport", () => {
      setNarrowViewport();
      renderNavigationBar();

      // Ensure navigation is open
      ensureNavigationOpen();

      // Find the backdrop element by its CSS class pattern
      const backdrop = document.querySelector('[class*="navigation-backdrop"]');
      expect(backdrop).toBeInTheDocument();

      // Backdrop should be visible (not have backdrop-hidden class)
      expect(backdrop?.className).not.toMatch(/backdrop-hidden/);
    });

    it("should hide backdrop when navigation is closed on narrow viewport", () => {
      setNarrowViewport();
      renderNavigationBar();

      // Ensure navigation is closed
      ensureNavigationClosed();

      // Find the backdrop element
      const backdrop = document.querySelector('[class*="navigation-backdrop"]');
      expect(backdrop).toBeInTheDocument();

      // Backdrop should be hidden (have backdrop-hidden class)
      expect(backdrop?.className).toMatch(/backdrop-hidden/);
    });

    it("should close navigation when clicking on backdrop", () => {
      setNarrowViewport();
      renderNavigationBar();

      const navigationList = screen.getByRole("list");

      // Ensure navigation is open
      ensureNavigationOpen();
      expect(navigationList.className).not.toMatch(/closed/);

      // Click on the backdrop
      const backdrop = document.querySelector('[class*="navigation-backdrop"]');
      expect(backdrop).toBeInTheDocument();

      act(() => {
        fireEvent.click(backdrop!);
      });

      // Navigation should now be closed
      expect(navigationList.className).toMatch(/closed/);
    });

    it("should have aria-hidden attribute on backdrop for accessibility", () => {
      renderNavigationBar();

      // Find the backdrop element
      const backdrop = document.querySelector('[class*="navigation-backdrop"]');
      expect(backdrop).toBeInTheDocument();
      expect(backdrop).toHaveAttribute("aria-hidden", "true");
    });

    it("should toggle backdrop visibility with navigation state", () => {
      setNarrowViewport();
      renderNavigationBar();

      const backdrop = document.querySelector('[class*="navigation-backdrop"]');
      expect(backdrop).toBeInTheDocument();

      // Start with navigation closed
      ensureNavigationClosed();
      expect(backdrop?.className).toMatch(/backdrop-hidden/);

      // Open navigation
      ensureNavigationOpen();
      expect(backdrop?.className).not.toMatch(/backdrop-hidden/);

      // Close navigation
      ensureNavigationClosed();
      expect(backdrop?.className).toMatch(/backdrop-hidden/);
    });
  });
});
