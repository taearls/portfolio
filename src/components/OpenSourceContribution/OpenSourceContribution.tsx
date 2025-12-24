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
          className="text-primary-text hover:text-accent-color -my-2 inline-flex min-h-11 min-w-11 items-center justify-center transition-colors"
        >
          <SvgIcon name="GithubIcon" width="18" height="18" />
        </a>
      </FlexContainer>

      {/* Metadata lines */}
      <Paragraph secondary>
        {prCount} {prCount === 1 ? "PR" : "PRs"} merged
      </Paragraph>
      <Paragraph secondary>
        <span style={{ color: "var(--accent-color)" }}>Tags:</span>{" "}
        {tags.join(" · ")}
      </Paragraph>

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
    </FlexContainer>
  );
}
