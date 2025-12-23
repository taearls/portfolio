/**
 * Unit tests for Tabs component
 */

import "@testing-library/jest-dom/vitest";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import Tabs from "@/components/Tabs/Tabs.tsx";

const defaultTabs = [
  { id: "tab-1", label: "First Tab", children: <div>First tab content</div> },
  { id: "tab-2", label: "Second Tab", children: <div>Second tab content</div> },
  { id: "tab-3", label: "Third Tab", children: <div>Third tab content</div> },
];

const renderWithRouter = (
  ui: React.ReactElement,
  { initialEntries = ["/"] } = {},
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>,
  );
};

describe("<Tabs />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render all tab buttons", () => {
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      expect(
        screen.getByRole("tab", { name: "First Tab" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Second Tab" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Third Tab" }),
      ).toBeInTheDocument();
    });

    it("should render the tablist with correct aria-label", () => {
      renderWithRouter(<Tabs tabs={defaultTabs} ariaLabel="Test tabs" />);

      expect(screen.getByRole("tablist")).toHaveAttribute(
        "aria-label",
        "Test tabs",
      );
    });

    it("should use default aria-label when not provided", () => {
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      expect(screen.getByRole("tablist")).toHaveAttribute(
        "aria-label",
        "Content tabs",
      );
    });

    it("should render first tab as active by default", () => {
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      const firstTab = screen.getByRole("tab", { name: "First Tab" });
      expect(firstTab).toHaveAttribute("aria-selected", "true");
      expect(firstTab).toHaveAttribute("tabindex", "0");
    });

    it("should render specified defaultTabId as active", () => {
      renderWithRouter(<Tabs tabs={defaultTabs} defaultTabId="tab-2" />);

      const secondTab = screen.getByRole("tab", { name: "Second Tab" });
      expect(secondTab).toHaveAttribute("aria-selected", "true");
    });

    it("should render the active tab panel content", () => {
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      expect(screen.getByText("First tab content")).toBeInTheDocument();
      expect(screen.queryByText("Second tab content")).not.toBeInTheDocument();
    });
  });

  describe("ARIA attributes", () => {
    it("should have correct role attributes", () => {
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      expect(screen.getByRole("tablist")).toBeInTheDocument();
      expect(screen.getAllByRole("tab")).toHaveLength(3);
      expect(screen.getByRole("tabpanel")).toBeInTheDocument();
    });

    it("should set aria-selected correctly for active and inactive tabs", () => {
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      const tabs = screen.getAllByRole("tab");
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      expect(tabs[1]).toHaveAttribute("aria-selected", "false");
      expect(tabs[2]).toHaveAttribute("aria-selected", "false");
    });

    it("should set tabindex correctly for active and inactive tabs", () => {
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      const tabs = screen.getAllByRole("tab");
      expect(tabs[0]).toHaveAttribute("tabindex", "0");
      expect(tabs[1]).toHaveAttribute("tabindex", "-1");
      expect(tabs[2]).toHaveAttribute("tabindex", "-1");
    });

    it("should have aria-controls linking tabs to panels", () => {
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      const firstTab = screen.getByRole("tab", { name: "First Tab" });
      const panelId = firstTab.getAttribute("aria-controls");

      expect(panelId).toBeTruthy();
      expect(screen.getByRole("tabpanel")).toHaveAttribute("id", panelId);
    });

    it("should have aria-labelledby linking panels to tabs", () => {
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      const firstTab = screen.getByRole("tab", { name: "First Tab" });
      const tabId = firstTab.getAttribute("id");

      expect(screen.getByRole("tabpanel")).toHaveAttribute(
        "aria-labelledby",
        tabId,
      );
    });
  });

  describe("click interaction", () => {
    it("should switch to clicked tab", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      await user.click(screen.getByRole("tab", { name: "Second Tab" }));

      expect(screen.getByRole("tab", { name: "Second Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByText("Second tab content")).toBeInTheDocument();
      expect(screen.queryByText("First tab content")).not.toBeInTheDocument();
    });

    it("should update tabindex when switching tabs", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      await user.click(screen.getByRole("tab", { name: "Third Tab" }));

      const tabs = screen.getAllByRole("tab");
      expect(tabs[0]).toHaveAttribute("tabindex", "-1");
      expect(tabs[1]).toHaveAttribute("tabindex", "-1");
      expect(tabs[2]).toHaveAttribute("tabindex", "0");
    });
  });

  describe("keyboard navigation", () => {
    it("should move to next tab with ArrowRight", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      const firstTab = screen.getByRole("tab", { name: "First Tab" });
      firstTab.focus();

      await user.keyboard("{ArrowRight}");

      expect(screen.getByRole("tab", { name: "Second Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("should move to previous tab with ArrowLeft", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Tabs tabs={defaultTabs} defaultTabId="tab-2" />);

      const secondTab = screen.getByRole("tab", { name: "Second Tab" });
      secondTab.focus();

      await user.keyboard("{ArrowLeft}");

      expect(screen.getByRole("tab", { name: "First Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("should wrap from last to first tab with ArrowRight", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Tabs tabs={defaultTabs} defaultTabId="tab-3" />);

      const thirdTab = screen.getByRole("tab", { name: "Third Tab" });
      thirdTab.focus();

      await user.keyboard("{ArrowRight}");

      expect(screen.getByRole("tab", { name: "First Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("should wrap from first to last tab with ArrowLeft", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      const firstTab = screen.getByRole("tab", { name: "First Tab" });
      firstTab.focus();

      await user.keyboard("{ArrowLeft}");

      expect(screen.getByRole("tab", { name: "Third Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("should move to first tab with Home key", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Tabs tabs={defaultTabs} defaultTabId="tab-3" />);

      const thirdTab = screen.getByRole("tab", { name: "Third Tab" });
      thirdTab.focus();

      await user.keyboard("{Home}");

      expect(screen.getByRole("tab", { name: "First Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("should move to last tab with End key", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      const firstTab = screen.getByRole("tab", { name: "First Tab" });
      firstTab.focus();

      await user.keyboard("{End}");

      expect(screen.getByRole("tab", { name: "Third Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("should focus the new tab after keyboard navigation", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      const firstTab = screen.getByRole("tab", { name: "First Tab" });
      firstTab.focus();

      await user.keyboard("{ArrowRight}");

      expect(screen.getByRole("tab", { name: "Second Tab" })).toHaveFocus();
    });
  });

  describe("URL query string sync", () => {
    it("should read initial tab from URL query param", () => {
      renderWithRouter(<Tabs tabs={defaultTabs} queryParam="tab" />, {
        initialEntries: ["/?tab=tab-2"],
      });

      expect(screen.getByRole("tab", { name: "Second Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByText("Second tab content")).toBeInTheDocument();
    });

    it("should fall back to defaultTabId for invalid query param", () => {
      renderWithRouter(
        <Tabs tabs={defaultTabs} queryParam="tab" defaultTabId="tab-1" />,
        {
          initialEntries: ["/?tab=invalid-tab"],
        },
      );

      expect(screen.getByRole("tab", { name: "First Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("should use defaultTabId when no query param present", () => {
      renderWithRouter(
        <Tabs tabs={defaultTabs} queryParam="tab" defaultTabId="tab-2" />,
        {
          initialEntries: ["/"],
        },
      );

      expect(screen.getByRole("tab", { name: "Second Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });
  });

  describe("local state mode (without queryParam)", () => {
    it("should work without queryParam prop", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      await user.click(screen.getByRole("tab", { name: "Second Tab" }));

      expect(screen.getByRole("tab", { name: "Second Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByText("Second tab content")).toBeInTheDocument();
    });

    it("should maintain state on keyboard navigation without queryParam", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      const firstTab = screen.getByRole("tab", { name: "First Tab" });
      firstTab.focus();

      await user.keyboard("{ArrowRight}");
      await user.keyboard("{ArrowRight}");

      expect(screen.getByRole("tab", { name: "Third Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByText("Third tab content")).toBeInTheDocument();
    });
  });

  describe("screen reader announcements", () => {
    it("should have a live region for tab changes", () => {
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      const liveRegion = screen.getByText("First Tab tab selected");
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
      expect(liveRegion).toHaveAttribute("aria-atomic", "true");
    });

    it("should update live region when tab changes", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      await user.click(screen.getByRole("tab", { name: "Second Tab" }));

      expect(screen.getByText("Second Tab tab selected")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle single tab", () => {
      const singleTab = [
        { id: "only", label: "Only Tab", children: <div>Only content</div> },
      ];

      renderWithRouter(<Tabs tabs={singleTab} />);

      expect(screen.getByRole("tab", { name: "Only Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByText("Only content")).toBeInTheDocument();
    });

    it("should handle tab with empty children", () => {
      const tabsWithEmpty = [
        { id: "empty", label: "Empty Tab", children: null },
        { id: "filled", label: "Filled Tab", children: <div>Content</div> },
      ];

      renderWithRouter(<Tabs tabs={tabsWithEmpty} />);

      expect(
        screen.getByRole("tab", { name: "Empty Tab" }),
      ).toBeInTheDocument();
    });

    it("should handle rapid tab switching", async () => {
      const user = userEvent.setup();
      renderWithRouter(<Tabs tabs={defaultTabs} />);

      await user.click(screen.getByRole("tab", { name: "Second Tab" }));
      await user.click(screen.getByRole("tab", { name: "Third Tab" }));
      await user.click(screen.getByRole("tab", { name: "First Tab" }));

      expect(screen.getByRole("tab", { name: "First Tab" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByText("First tab content")).toBeInTheDocument();
    });
  });
});
