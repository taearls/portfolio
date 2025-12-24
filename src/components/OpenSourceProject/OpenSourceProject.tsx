import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingTwo from "@/components/layout/headings/HeadingTwo.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import RenderIf from "@/components/layout/RenderIf.tsx";
import SvgIcon from "@/components/SvgIcon/SvgIcon.tsx";
import { AlignItemsCSSValue, FlexFlowCSSValue } from "@/types/layout.ts";

export type OpenSourceProjectProps = {
  name: string;
  descriptions: Array<string>;
  githubUrl: string;
  tags: Array<string>;
  isLast: boolean;
  /** ISO date string for sorting (YYYY-MM-DD) */
  lastModified?: string;
};

export default function OpenSourceProject({
  name,
  descriptions,
  githubUrl,
  tags,
  isLast,
}: OpenSourceProjectProps) {
  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={2}>
      {/* Project name with GitHub link */}
      <FlexContainer inline gapX={2} alignItems={AlignItemsCSSValue.BASELINE}>
        <HeadingTwo>{name}</HeadingTwo>
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${name} on GitHub`}
          className="text-primary-text hover:text-accent-color -my-2 inline-flex min-h-11 min-w-11 items-center justify-center transition-colors"
        >
          <SvgIcon name="GithubIcon" width="18" height="18" />
        </a>
      </FlexContainer>

      {/* Metadata line */}
      <Paragraph secondary>
        <span style={{ color: "var(--accent-color)" }}>Tags:</span>{" "}
        {tags.join(" · ")}
      </Paragraph>

      {/* Descriptions */}
      {descriptions.map((description) => (
        <Paragraph key={description}>{description}</Paragraph>
      ))}

      <RenderIf condition={!isLast}>
        <hr className="line-break mt-3" />
      </RenderIf>
    </FlexContainer>
  );
}
