import type { OpenSourceContributionProps } from "@/util/constants.ts";

import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingThree from "@/components/layout/headings/HeadingThree.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import RenderIf from "@/components/layout/RenderIf.tsx";
import SvgIcon from "@/components/SvgIcon/SvgIcon.tsx";
import Tag from "@/components/Tag/Tag.tsx";
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
  isLast,
}: OpenSourceContributionComponentProps) {
  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={4}>
      <FlexContainer
        flexFlow={FlexFlowCSSValue.ROW}
        alignItems={AlignItemsCSSValue.CENTER}
        gapX={3}
      >
        <HeadingThree>{projectName}</HeadingThree>
        <Tag label={`${prCount} ${prCount === 1 ? "PR" : "PRs"} merged`} />
      </FlexContainer>
      <FlexContainer
        flexFlow={FlexFlowCSSValue.COLUMN}
        alignItems={AlignItemsCSSValue.START}
        gapY={3}
      >
        <InlineAnchor
          isExternal
          accent
          ariaLabel={`View ${projectName} on GitHub`}
          href={projectUrl}
        >
          <FlexContainer inline gapX={2} alignItems={AlignItemsCSSValue.CENTER}>
            <SvgIcon name="GithubIcon" width="18" height="18" />
            <Paragraph>View repository</Paragraph>
          </FlexContainer>
        </InlineAnchor>
        <Tag label={language} />
      </FlexContainer>
      <Paragraph>{description}</Paragraph>
      <ul
        className="m-0 list-disc space-y-1 pl-5"
        aria-label={`Contribution highlights for ${projectName}`}
      >
        {highlights.map((highlight) => (
          <li key={highlight} className="text-primary-text text-sm">
            {highlight}
          </li>
        ))}
      </ul>
      <RenderIf condition={!isLast}>
        <hr className="line-break mt-4" />
      </RenderIf>
    </FlexContainer>
  );
}
