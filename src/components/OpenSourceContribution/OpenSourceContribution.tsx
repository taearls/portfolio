import type { OpenSourceContributionProps } from "@/util/constants.ts";

import { useId } from "react";

import CountLabel from "@/components/CountLabel/CountLabel.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingTwo from "@/components/layout/headings/HeadingTwo.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import RenderIf from "@/components/layout/RenderIf.tsx";
import SvgIcon from "@/components/SvgIcon/SvgIcon.tsx";
import { AlignItemsCSSValue, FlexFlowCSSValue } from "@/types/layout.ts";
import styles from "../ProjectCard/ProjectCard.module.css";

type OpenSourceContributionComponentProps = OpenSourceContributionProps & {
  isLast: boolean;
  /** Whether the contribution card is expanded */
  isExpanded?: boolean;
  /** Callback when expand/collapse state changes */
  onExpandedChange?: (isExpanded: boolean) => void;
};

export default function OpenSourceContribution({
  projectName,
  projectUrl,
  description,
  prCount,
  highlights,
  tags,
  isLast,
  isExpanded = true,
  onExpandedChange,
}: OpenSourceContributionComponentProps) {
  const contentId = useId();

  const handleToggle = () => {
    onExpandedChange?.(!isExpanded);
  };

  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={2}>
      {/* Project name with expand/collapse toggle */}
      <FlexContainer inline gapX={2} alignItems={AlignItemsCSSValue.BASELINE}>
        <HeadingTwo>{projectName}</HeadingTwo>
        <button
          type="button"
          className={styles.toggleButton}
          onClick={handleToggle}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          aria-label={
            isExpanded ? `Collapse ${projectName}` : `Expand ${projectName}`
          }
        >
          <SvgIcon
            name="ChevronIcon"
            width="20"
            height="20"
            accent={false}
            color="currentColor"
            data-testid={`chevron-${projectName}`}
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
      >
        <div className={styles.collapsibleInner}>
          {/* Links and tags on same row */}
          <FlexContainer inline gapX={2} alignItems={AlignItemsCSSValue.CENTER}>
            <a
              href={projectUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${projectName} on GitHub`}
              className="text-primary-text hover:text-accent-color inline-flex items-center justify-center transition-colors"
            >
              <SvgIcon name="GithubIcon" width="18" height="18" />
            </a>
            <span className="text-secondary-text ml-2 text-lg lg:text-xl">
              <span className="text-accent-color">Tags:</span> {tags.join(" · ")}
            </span>
          </FlexContainer>

          {/* PR count */}
          <CountLabel
            count={prCount}
            label={{ singular: "PR merged", plural: "PRs merged" }}
          />

          {/* Description */}
          <Paragraph>{description}</Paragraph>

          {/* Highlights */}
          <ul
            className="m-0 list-disc space-y-1 pl-5"
            aria-label={`Contribution highlights for ${projectName}`}
          >
            {highlights.map((highlight) => (
              <li
                key={highlight}
                className="text-primary-text text-lg leading-normal lg:text-xl"
              >
                {highlight}
              </li>
            ))}
          </ul>

          <RenderIf condition={!isLast}>
            <hr className="line-break mt-3" />
          </RenderIf>
        </div>
      </div>
    </FlexContainer>
  );
}
