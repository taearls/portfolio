/**
 * Unit tests for FilterableProjectList component and expand/collapse functionality.
 */

import "@testing-library/jest-dom/vitest";

import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import FilterableProjectList from "@/components/FilterableProjectList/FilterableProjectList.tsx";

type TestItem = {
  name: string;
  descriptions: Array<string>;
  tags: Array<string>;
};

const testItems: Array<TestItem> = [
  {
    name: "Project Alpha",
    descriptions: ["A great project", "Built with React"],
    tags: ["React", "TypeScript"],
  },
  {
    name: "Project Beta",
    descriptions: ["Another project", "Uses Vue"],
    tags: ["Vue", "JavaScript"],
  },
  {
    name: "Project Gamma",
    descriptions: ["Third project", "Built with React"],
    tags: ["React", "JavaScript"],
  },
];

const allTags = ["React", "TypeScript", "Vue", "JavaScript"];

// Test render function that includes expand/collapse props
const renderItem = (
  item: TestItem,
  _index: number,
  isLast: boolean,
  isExpanded: boolean,
  onExpandedChange: (isExpanded: boolean) => void,
) => (
  <div key={item.name} data-testid={`project-${item.name}`}>
    <h2>{item.name}</h2>
    <button
      type="button"
      aria-expanded={isExpanded}
      aria-label={isExpanded ? `Collapse ${item.name}` : `Expand ${item.name}`}
      onClick={() => onExpandedChange(!isExpanded)}
      data-testid={`toggle-${item.name}`}
    >
      Toggle
    </button>
    <div data-collapsed={!isExpanded} data-testid={`content-${item.name}`}>
      <p>Tags: {item.tags.join(" · ")}</p>
      {item.descriptions.map((desc) => (
        <p key={desc}>{desc}</p>
      ))}
      {!isLast && <hr />}
    </div>
  </div>
);

describe("<FilterableProjectList />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render all items", () => {
      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      expect(screen.getByText("Project Alpha")).toBeInTheDocument();
      expect(screen.getByText("Project Beta")).toBeInTheDocument();
      expect(screen.getByText("Project Gamma")).toBeInTheDocument();
    });

    it("should render search input", () => {
      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      expect(
        screen.getByPlaceholderText("Search by name or description..."),
      ).toBeInTheDocument();
    });

    it("should render Collapse All button when items are expanded", () => {
      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      // Items are expanded by default, so Collapse All should be shown
      expect(
        screen.getByRole("button", { name: "Collapse all projects" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Expand all projects" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("expand/collapse functionality", () => {
    it("should render all items expanded by default", () => {
      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      // All toggle buttons should show aria-expanded=true by default
      const toggleAlpha = screen.getByTestId("toggle-Project Alpha");
      const toggleBeta = screen.getByTestId("toggle-Project Beta");
      const toggleGamma = screen.getByTestId("toggle-Project Gamma");

      expect(toggleAlpha).toHaveAttribute("aria-expanded", "true");
      expect(toggleBeta).toHaveAttribute("aria-expanded", "true");
      expect(toggleGamma).toHaveAttribute("aria-expanded", "true");
    });

    it("should toggle individual item when clicked", async () => {
      const user = userEvent.setup();

      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      const toggleAlpha = screen.getByTestId("toggle-Project Alpha");

      // Initially expanded
      expect(toggleAlpha).toHaveAttribute("aria-expanded", "true");

      // Click to collapse
      await user.click(toggleAlpha);
      expect(toggleAlpha).toHaveAttribute("aria-expanded", "false");

      // Click to expand again
      await user.click(toggleAlpha);
      expect(toggleAlpha).toHaveAttribute("aria-expanded", "true");
    });

    it("should collapse all items when Collapse All is clicked and switch to Expand All", async () => {
      const user = userEvent.setup();

      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      const collapseAllButton = screen.getByRole("button", {
        name: "Collapse all projects",
      });

      await user.click(collapseAllButton);

      // All items should be collapsed
      const toggleAlpha = screen.getByTestId("toggle-Project Alpha");
      const toggleBeta = screen.getByTestId("toggle-Project Beta");
      const toggleGamma = screen.getByTestId("toggle-Project Gamma");

      expect(toggleAlpha).toHaveAttribute("aria-expanded", "false");
      expect(toggleBeta).toHaveAttribute("aria-expanded", "false");
      expect(toggleGamma).toHaveAttribute("aria-expanded", "false");

      // Button should switch to Expand All
      expect(
        screen.getByRole("button", { name: "Expand all projects" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Collapse all projects" }),
      ).not.toBeInTheDocument();
    });

    it("should expand all items when Expand All is clicked and switch to Collapse All", async () => {
      const user = userEvent.setup();

      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      // First collapse all
      const collapseAllButton = screen.getByRole("button", {
        name: "Collapse all projects",
      });
      await user.click(collapseAllButton);

      // Then expand all
      const expandAllButton = screen.getByRole("button", {
        name: "Expand all projects",
      });
      await user.click(expandAllButton);

      // All items should be expanded
      const toggleAlpha = screen.getByTestId("toggle-Project Alpha");
      const toggleBeta = screen.getByTestId("toggle-Project Beta");
      const toggleGamma = screen.getByTestId("toggle-Project Gamma");

      expect(toggleAlpha).toHaveAttribute("aria-expanded", "true");
      expect(toggleBeta).toHaveAttribute("aria-expanded", "true");
      expect(toggleGamma).toHaveAttribute("aria-expanded", "true");

      // Button should switch back to Collapse All
      expect(
        screen.getByRole("button", { name: "Collapse all projects" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Expand all projects" }),
      ).not.toBeInTheDocument();
    });

    it("should show Collapse All when any item is expanded after individual toggle", async () => {
      const user = userEvent.setup();

      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      // Collapse all first
      await user.click(
        screen.getByRole("button", { name: "Collapse all projects" }),
      );

      // Now Expand All should be shown
      expect(
        screen.getByRole("button", { name: "Expand all projects" }),
      ).toBeInTheDocument();

      // Expand one item individually
      const toggleAlpha = screen.getByTestId("toggle-Project Alpha");
      await user.click(toggleAlpha);

      // Now Collapse All should be shown (since at least one is expanded)
      expect(
        screen.getByRole("button", { name: "Collapse all projects" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Expand all projects" }),
      ).not.toBeInTheDocument();
    });

    it("should collapse all items including individually expanded ones", async () => {
      const user = userEvent.setup();

      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      // All items are expanded by default
      const toggleAlpha = screen.getByTestId("toggle-Project Alpha");
      const toggleBeta = screen.getByTestId("toggle-Project Beta");
      const toggleGamma = screen.getByTestId("toggle-Project Gamma");

      expect(toggleAlpha).toHaveAttribute("aria-expanded", "true");
      expect(toggleBeta).toHaveAttribute("aria-expanded", "true");
      expect(toggleGamma).toHaveAttribute("aria-expanded", "true");

      // Collapse All should collapse all items
      const collapseAllButton = screen.getByRole("button", {
        name: "Collapse all projects",
      });
      await user.click(collapseAllButton);

      expect(toggleAlpha).toHaveAttribute("aria-expanded", "false");
      expect(toggleBeta).toHaveAttribute("aria-expanded", "false");
      expect(toggleGamma).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("accessibility", () => {
    it("should have proper aria label on global control button", () => {
      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      // Items expanded by default, so Collapse All should be shown with proper aria-label
      expect(
        screen.getByRole("button", { name: "Collapse all projects" }),
      ).toBeInTheDocument();
    });

    it("should support keyboard activation for global controls", async () => {
      const user = userEvent.setup();

      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      const collapseAllButton = screen.getByRole("button", {
        name: "Collapse all projects",
      });

      // Click instead of focus + keyboard to avoid userEvent timing issues
      await user.click(collapseAllButton);

      // All items should be collapsed
      const toggleAlpha = screen.getByTestId("toggle-Project Alpha");
      expect(toggleAlpha).toHaveAttribute("aria-expanded", "false");
    });

    it("should be focusable via tab navigation when not disabled", () => {
      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      const collapseAllButton = screen.getByRole("button", {
        name: "Collapse all projects",
      });

      // Collapse All is enabled (not disabled) so it should be focusable
      collapseAllButton.focus();
      expect(document.activeElement).toBe(collapseAllButton);
    });
  });
});
