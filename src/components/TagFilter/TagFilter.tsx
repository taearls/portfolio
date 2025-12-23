import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import Tag from "@/components/Tag/Tag.tsx";
import { FlexFlowCSSValue } from "@/types/layout.ts";
import styles from "./TagFilter.module.css";

export type TagFilterProps = {
  tags: Array<string>;
  selectedTags: Array<string>;
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
};

export default function TagFilter({
  tags,
  selectedTags,
  onTagToggle,
  onClearAll,
}: TagFilterProps) {
  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={2}>
      <div className={styles["tag-filter-header"]}>
        <span className={styles["tag-filter-label"]}>
          Filter by technology:
        </span>
        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className={styles["clear-button"]}
            aria-label="Clear all selected filters"
          >
            Clear all
          </button>
        )}
      </div>
      <div
        className={styles["tag-container"]}
        role="group"
        aria-label="Technology filters"
      >
        {tags.map((tag) => (
          <Tag
            key={tag}
            label={tag}
            isSelected={selectedTags.includes(tag)}
            onClick={() => onTagToggle(tag)}
          />
        ))}
      </div>
    </FlexContainer>
  );
}
