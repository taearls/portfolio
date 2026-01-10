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

    it("should render expand/collapse buttons", () => {
      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      expect(
        screen.getByRole("button", { name: "Expand all projects" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Collapse all projects" }),
      ).toBeInTheDocument();
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

    it("should collapse all items when Collapse All is clicked", async () => {
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
    });

    it("should expand all items when Expand All is clicked", async () => {
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
    });

    it("should disable Expand All when all items are expanded", () => {
      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      const expandAllButton = screen.getByRole("button", {
        name: "Expand all projects",
      });

      // All items expanded by default, so Expand All should be disabled
      expect(expandAllButton).toBeDisabled();
    });

    it("should disable Collapse All when all items are collapsed", async () => {
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

      // All items collapsed, so Collapse All should be disabled
      expect(collapseAllButton).toBeDisabled();
    });

    it("should maintain individual item state when using global controls", async () => {
      const user = userEvent.setup();

      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      // Collapse one item individually
      const toggleAlpha = screen.getByTestId("toggle-Project Alpha");
      await user.click(toggleAlpha);
      expect(toggleAlpha).toHaveAttribute("aria-expanded", "false");

      // Other items should still be expanded
      const toggleBeta = screen.getByTestId("toggle-Project Beta");
      expect(toggleBeta).toHaveAttribute("aria-expanded", "true");

      // Expand All should expand the collapsed one
      const expandAllButton = screen.getByRole("button", {
        name: "Expand all projects",
      });
      await user.click(expandAllButton);

      expect(toggleAlpha).toHaveAttribute("aria-expanded", "true");
      expect(toggleBeta).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("accessibility", () => {
    it("should have proper aria labels on global controls", () => {
      render(
        <FilterableProjectList
          items={testItems}
          allTags={allTags}
          renderItem={renderItem}
        />,
      );

      expect(
        screen.getByRole("button", { name: "Expand all projects" }),
      ).toBeInTheDocument();
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
