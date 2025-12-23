import type { WebProjectAnalytics } from "@/types/WebProject.ts";
import type { ReactNode } from "react";

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

export type WebProjectProps = {
  analytics?: WebProjectAnalytics;
  cloudinaryId: { default: string; dark?: string };
  alt: string;
  cursorStyle?: string;
  descriptions: Array<string>;
  emoji?: ReactNode;
  href: string;
  name: string;
  width?: number;
  height?: number;
  tagline: string;
  tags: Array<string>;
  isLast: boolean;
};

export default function WebProject({
  analytics,
  cloudinaryId,
  alt,
  descriptions,
  href,
  name,
  width,
  height,
  tags,
  isLast,
}: WebProjectProps) {
  const isLightMode =
    ThemeContext.useSelector((state) => state.value) === THEME_STATES.LIGHT;

  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={2}>
      {/* Project name with external link */}
      <FlexContainer inline gapX={2} alignItems={AlignItemsCSSValue.BASELINE}>
        <HeadingTwo>{name}</HeadingTwo>
        <a
          href={getLinkWithAnalytics(href, analytics)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Visit ${name}`}
          className="text-primary-text hover:text-accent-color transition-colors"
        >
          <SvgIcon name="ExternalLinkIcon" width="18" height="18" />
        </a>
      </FlexContainer>

      {/* Metadata line */}
      <p className="text-secondary-text m-0 text-sm">{tags.join(" · ")}</p>

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
    </FlexContainer>
  );
}
