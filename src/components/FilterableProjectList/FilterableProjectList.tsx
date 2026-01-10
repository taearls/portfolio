import type { ReactNode } from "react";

import { useCallback, useMemo, useState } from "react";

import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import RenderIf from "@/components/layout/RenderIf.tsx";
import SearchInput from "@/components/SearchInput/SearchInput.tsx";
import TagFilter from "@/components/TagFilter/TagFilter.tsx";
import { AlignItemsCSSValue, FlexFlowCSSValue } from "@/types/layout.ts";
import styles from "../ProjectCard/ProjectCard.module.css";

export type FilterableItem = {
  name: string;
  descriptions: Array<string>;
  tags: Array<string>;
};

type FilterableProjectListProps<T extends FilterableItem> = {
  /** The list of items to filter and display */
  items: Array<T>;
  /** All available tags for the filter */
  allTags: Array<string>;
  /** Function to render each item */
  renderItem: (
    item: T,
    index: number,
    isLast: boolean,
    isExpanded: boolean,
    onExpandedChange: (isExpanded: boolean) => void,
  ) => ReactNode;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
};

/**
 * Generic filter function for items with name, descriptions, and tags.
 */
function filterItems<T extends FilterableItem>(
  items: Array<T>,
  searchTerm: string,
  selectedTags: Array<string>,
): Array<T> {
  return items.filter((item) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      searchLower === "" ||
      item.name.toLowerCase().includes(searchLower) ||
      item.descriptions.some((desc) =>
        desc.toLowerCase().includes(searchLower),
      );

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => item.tags.includes(tag));

    return matchesSearch && matchesTags;
  });
}

export default function FilterableProjectList<T extends FilterableItem>({
  items,
  allTags,
  renderItem,
  searchPlaceholder = "Search by name or description...",
}: FilterableProjectListProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);

  // Track expanded state per item by name
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const filteredItems = useMemo(
    () => filterItems(items, searchTerm, selectedTags),
    [items, searchTerm, selectedTags],
  );

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const handleClearAllTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  // Check if an item is expanded (default is true)
  const isItemExpanded = useCallback(
    (itemName: string): boolean => {
      return expandedItems[itemName] ?? true;
    },
    [expandedItems],
  );

  // Handle individual item expand/collapse
  const handleItemExpandedChange = useCallback(
    (itemName: string, isExpanded: boolean) => {
      setExpandedItems((prev) => ({
        ...prev,
        [itemName]: isExpanded,
      }));
    },
    [],
  );

  // Expand all filtered items
  const handleExpandAll = useCallback(() => {
    setExpandedItems((prev) => {
      const next = { ...prev };
      for (const item of filteredItems) {
        next[item.name] = true;
      }
      return next;
    });
  }, [filteredItems]);

  // Collapse all filtered items
  const handleCollapseAll = useCallback(() => {
    setExpandedItems((prev) => {
      const next = { ...prev };
      for (const item of filteredItems) {
        next[item.name] = false;
      }
      return next;
    });
  }, [filteredItems]);

  // Check if all filtered items are expanded or collapsed
  const allExpanded = useMemo(
    () => filteredItems.every((item) => isItemExpanded(item.name)),
    [filteredItems, isItemExpanded],
  );

  const allCollapsed = useMemo(
    () => filteredItems.every((item) => !isItemExpanded(item.name)),
    [filteredItems, isItemExpanded],
  );

  const hasActiveFilters = searchTerm !== "" || selectedTags.length > 0;
  const noResultsFound = filteredItems.length === 0 && hasActiveFilters;

  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
      <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={4}>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={searchPlaceholder}
        />
        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearAll={handleClearAllTags}
        />

        {/* Global expand/collapse controls */}
        <RenderIf condition={filteredItems.length > 0}>
          <div className={styles.globalControls}>
            <button
              type="button"
              className={styles.globalControlButton}
              onClick={handleExpandAll}
              disabled={allExpanded}
              aria-label="Expand all projects"
            >
              Expand All
            </button>
            <button
              type="button"
              className={styles.globalControlButton}
              onClick={handleCollapseAll}
              disabled={allCollapsed}
              aria-label="Collapse all projects"
            >
              Collapse All
            </button>
          </div>
        </RenderIf>

        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {hasActiveFilters &&
            (noResultsFound
              ? "No items found matching your criteria."
              : `Showing ${filteredItems.length} ${filteredItems.length === 1 ? "item" : "items"}.`)}
        </div>
      </FlexContainer>

      <RenderIf condition={noResultsFound}>
        <FlexContainer
          flexFlow={FlexFlowCSSValue.COLUMN}
          alignItems={AlignItemsCSSValue.CENTER}
          gapY={4}
        >
          <Paragraph>
            {
              "No items found matching your criteria. Try adjusting your search or filters."
            }
          </Paragraph>
        </FlexContainer>
      </RenderIf>

      <RenderIf condition={!noResultsFound}>
        <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
          {filteredItems.map((item, index) =>
            renderItem(
              item,
              index,
              index === filteredItems.length - 1,
              isItemExpanded(item.name),
              (isExpanded) => handleItemExpandedChange(item.name, isExpanded),
            ),
          )}
        </FlexContainer>
      </RenderIf>
    </FlexContainer>
  );
}
