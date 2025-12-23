import type { FlexContainerProps } from "@/types/FlexContainer.ts";

import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingTwo from "@/components/layout/headings/HeadingTwo.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import RenderIf from "@/components/layout/RenderIf.tsx";
import SvgIcon from "@/components/SvgIcon/SvgIcon.tsx";
import Tag from "@/components/Tag/Tag.tsx";
import {
  AlignItemsCSSValue,
  FlexFlowCSSValue,
  MediaQueryPrefixValue,
} from "@/types/layout.ts";

export type OpenSourceProjectProps = {
  name: string;
  descriptions: Array<string>;
  githubUrl: string;
  language: string;
  tags: Array<string>;
  isLast: boolean;
};

const projectContainerResponsiveStyle: FlexContainerProps["responsive"] = {
  alignItems: [
    { prefix: MediaQueryPrefixValue.MD, value: AlignItemsCSSValue.START },
  ],
  flexFlow: [{ prefix: MediaQueryPrefixValue.MD, value: FlexFlowCSSValue.ROW }],
};

export default function OpenSourceProject({
  name,
  descriptions,
  githubUrl,
  language,
  tags,
  isLast,
}: OpenSourceProjectProps) {
  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
      <HeadingTwo>{name}</HeadingTwo>
      <FlexContainer
        gapX={8}
        gapY={4}
        flexFlow={FlexFlowCSSValue.COLUMN}
        alignItems={AlignItemsCSSValue.START}
        responsive={projectContainerResponsiveStyle}
      >
        <FlexContainer
          inline
          flexFlow={FlexFlowCSSValue.COLUMN}
          alignItems={AlignItemsCSSValue.START}
          gapY={4}
        >
          <InlineAnchor
            isExternal
            accent
            ariaLabel={`View ${name} on GitHub`}
            href={githubUrl}
          >
            <FlexContainer
              inline
              gapX={2}
              alignItems={AlignItemsCSSValue.CENTER}
            >
              <SvgIcon name="GithubIcon" width="20" height="20" />
              <Paragraph>View on GitHub</Paragraph>
            </FlexContainer>
          </InlineAnchor>
          <Tag label={language} />
        </FlexContainer>
        <FlexContainer
          inline
          flexFlow={FlexFlowCSSValue.COLUMN}
          alignSelf={AlignItemsCSSValue.START}
          gapY={4}
        >
          {descriptions.map((description) => (
            <Paragraph key={description} width="md:w-[35ch] lg:w-fit">
              {description}
            </Paragraph>
          ))}
          <ul
            className="m-0 flex list-none flex-wrap gap-2 p-0"
            aria-label="Technologies used"
          >
            {tags.map((tag) => (
              <li key={tag}>
                <Tag label={tag} />
              </li>
            ))}
          </ul>
        </FlexContainer>
      </FlexContainer>
      <RenderIf condition={!isLast}>
        <hr className="line-break" />
      </RenderIf>
    </FlexContainer>
  );
}
