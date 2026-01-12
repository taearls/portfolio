import type { WebProjectAnalytics } from "@/types/WebProject.ts";
import type { ReactNode } from "react";

import { useId } from "react";

import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingTwo from "@/components/layout/headings/HeadingTwo.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import RenderIf from "@/components/layout/RenderIf.tsx";
import SvgIcon from "@/components/SvgIcon/SvgIcon.tsx";
import ThemeContext from "@/state/contexts/ThemeContext.tsx";
import { THEME_STATES } from "@/state/machines/themeMachine.ts";
import { AlignItemsCSSValue, FlexFlowCSSValue } from "@/types/layout.ts";
import { getLinkWithAnalytics } from "@/util/utils.ts";
import WebProjectImage from "../CloudinaryImage/images/WebProjectImage.tsx";
import styles from "../ProjectCard/ProjectCard.module.css";

export type WebProjectProps = {
  analytics?: WebProjectAnalytics;
  cloudinaryId: { default: string; dark?: string };
  alt: string;
  cursorStyle?: string;
  descriptions: Array<string>;
  emoji?: ReactNode;
  /** Optional GitHub repository URL */
  githubUrl?: string;
  href: string;
  name: string;
  width?: number;
  height?: number;
  tagline: string;
  tags: Array<string>;
  isLast: boolean;
  /** Whether the project card is expanded */
  isExpanded?: boolean;
  /** Callback when expand/collapse state changes */
  onExpandedChange?: (isExpanded: boolean) => void;
};

export default function WebProject({
  analytics,
  cloudinaryId,
  alt,
  descriptions,
  githubUrl,
  href,
  name,
  width,
  height,
  tags,
  isLast,
  isExpanded = true,
  onExpandedChange,
}: WebProjectProps) {
  const isLightMode =
    ThemeContext.useSelector((state) => state.value) === THEME_STATES.LIGHT;

  const contentId = useId();

  const handleToggle = () => {
    onExpandedChange?.(!isExpanded);
  };

  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={2}>
      {/* Project name with expand/collapse toggle */}
      <FlexContainer inline gapX={2} alignItems={AlignItemsCSSValue.BASELINE}>
        <HeadingTwo>{name}</HeadingTwo>
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
          {/* Tags and links on same row */}
          <div className="flex items-center gap-x-4">
            <span className="text-secondary-text text-lg lg:text-xl">
              <span style={{ color: "var(--accent-color)" }}>Tags:</span>{" "}
              {tags.join(" · ")}
            </span>
            <div className="flex items-center gap-x-2">
              <RenderIf condition={!!githubUrl}>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${name} on GitHub`}
                  className="text-primary-text hover:text-accent-color inline-flex items-center justify-center transition-colors"
                >
                  <SvgIcon name="GithubIcon" width="18" height="18" />
                </a>
              </RenderIf>
              <a
                href={getLinkWithAnalytics(href, analytics)}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${name}`}
                className="text-primary-text hover:text-accent-color inline-flex items-center justify-center transition-colors"
              >
                <SvgIcon name="ExternalLinkIcon" width="18" height="18" />
              </a>
            </div>
          </div>

          {/* Project image */}
          <div className="my-2 max-w-md">
            <InlineAnchor
              href={getLinkWithAnalytics(href, analytics)}
              ariaLabel={`Navigate to ${name}`}
              underline={false}
            >
              <WebProjectImage
                alt={alt}
                publicId={
                  isLightMode && cloudinaryId.dark
                    ? cloudinaryId.dark
                    : cloudinaryId.default
                }
                width={width}
                height={height}
              />
            </InlineAnchor>
          </div>

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
