import { useId } from "react";

import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingTwo from "@/components/layout/headings/HeadingTwo.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import RenderIf from "@/components/layout/RenderIf.tsx";
import SvgIcon from "@/components/SvgIcon/SvgIcon.tsx";
import { AlignItemsCSSValue, FlexFlowCSSValue } from "@/types/layout.ts";
import styles from "../ProjectCard/ProjectCard.module.css";

export type OpenSourceProjectProps = {
  name: string;
  descriptions: Array<string>;
  githubUrl: string;
  tags: Array<string>;
  isLast: boolean;
  /** ISO date string for sorting (YYYY-MM-DD) */
  lastModified?: string;
  /** Whether the project card is expanded */
  isExpanded?: boolean;
  /** Callback when expand/collapse state changes */
  onExpandedChange?: (isExpanded: boolean) => void;
};

export default function OpenSourceProject({
  name,
  descriptions,
  githubUrl,
  tags,
  isLast,
  isExpanded = true,
  onExpandedChange,
}: OpenSourceProjectProps) {
  const contentId = useId();

  const handleToggle = () => {
    onExpandedChange?.(!isExpanded);
  };

  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={2}>
      {/* Project name with animated icons and expand/collapse toggle */}
      <FlexContainer inline gapX={2} alignItems={AlignItemsCSSValue.CENTER}>
        <HeadingTwo>{name}</HeadingTwo>

        {/* Animated icon links - visible when expanded */}
        <div
          className={styles.headerIcons}
          data-expanded={isExpanded}
          aria-hidden={!isExpanded}
        >
          <span className={styles.headerIconsSpacer} aria-hidden="true" />
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${name} on GitHub`}
            tabIndex={isExpanded ? 0 : -1}
          >
            <SvgIcon name="GithubIcon" width="18" height="18" />
          </a>
        </div>

        <button
          type="button"
          className={styles.toggleButton}
          onClick={handleToggle}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          aria-label={isExpanded ? `Collapse ${name}` : `Expand ${name}`}
        >
          <SvgIcon
            name="ChevronIcon"
            width="20"
            height="20"
            accent={false}
            color="currentColor"
            data-testid={`chevron-${name}`}
            className={styles.chevronIcon}
            data-expanded={isExpanded}
          />
        </button>
      </FlexContainer>

      {/* Collapsible content */}
      <div
        id={contentId}
        className={styles.collapsibleContent}
        data-collapsed={!isExpanded}
        aria-hidden={!isExpanded}
        inert={!isExpanded ? true : undefined}
      >
        <div className={styles.collapsibleInner}>
          {/* Tags */}
          <span className="text-secondary-text text-lg lg:text-xl">
            <span style={{ color: "var(--accent-color)" }}>Tags:</span>{" "}
            {tags.join(" · ")}
          </span>

          {/* Descriptions */}
          {descriptions.map((description) => (
            <Paragraph key={description}>{description}</Paragraph>
          ))}

          <RenderIf condition={!isLast}>
            <hr className="line-break mt-3" />
          </RenderIf>
        </div>
      </div>
    </FlexContainer>
  );
}
