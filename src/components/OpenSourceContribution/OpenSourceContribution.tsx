import type { OpenSourceContributionProps } from "@/util/constants.ts";

import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingTwo from "@/components/layout/headings/HeadingTwo.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import RenderIf from "@/components/layout/RenderIf.tsx";
import SvgIcon from "@/components/SvgIcon/SvgIcon.tsx";
import { AlignItemsCSSValue, FlexFlowCSSValue } from "@/types/layout.ts";

type OpenSourceContributionComponentProps = OpenSourceContributionProps & {
  isLast: boolean;
};

export default function OpenSourceContribution({
  projectName,
  projectUrl,
  description,
  prCount,
  language,
  highlights,
  tags,
  isLast,
}: OpenSourceContributionComponentProps) {
  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={2}>
      {/* Project name with GitHub link */}
      <FlexContainer inline gapX={2} alignItems={AlignItemsCSSValue.BASELINE}>
        <HeadingTwo>{projectName}</HeadingTwo>
        <a
          href={projectUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${projectName} on GitHub`}
          className="text-primary-text hover:text-accent-color transition-colors"
        >
          <SvgIcon name="GithubIcon" width="18" height="18" />
        </a>
      </FlexContainer>

      {/* Metadata lines */}
      <p className="text-secondary-text m-0 text-sm">
        {prCount} {prCount === 1 ? "PR" : "PRs"} merged
      </p>
      <p className="text-secondary-text m-0 text-sm">
        Primary language: {language}
      </p>
      <p className="text-secondary-text m-0 text-sm">
        Tags: {tags.join(" · ")}
      </p>

      {/* Description */}
      <Paragraph>{description}</Paragraph>

      {/* Highlights */}
      <ul
        className="m-0 list-disc space-y-0.5 pl-5"
        aria-label={`Contribution highlights for ${projectName}`}
      >
        {highlights.map((highlight) => (
          <li key={highlight} className="text-primary-text text-sm">
            {highlight}
          </li>
        ))}
      </ul>

      <RenderIf condition={!isLast}>
        <hr className="line-break mt-3" />
      </RenderIf>
    </FlexContainer>
  );
}
