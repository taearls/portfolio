import type { FlexContainerProps } from "@/types/FlexContainer.ts";
import type { WebProjectAnalytics } from "@/types/WebProject.ts";
import type { ReactNode } from "react";

import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingTwo from "@/components/layout/headings/HeadingTwo.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import {
  AlignItemsCSSValue,
  FlexFlowCSSValue,
  JustifyContentCSSValue,
  MediaQueryPrefixValue,
} from "@/types/layout.ts";
import { getLinkWithAnalytics } from "@/util/utils.ts";
import WebProjectImage from "../CloudinaryImage/images/WebProjectImage.tsx";
import RenderIf from "../layout/RenderIf.tsx";

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
  isLast: boolean;
};

const webProjectContainerResponsiveStyle: FlexContainerProps["responsive"] = {
  alignItems: [
    { prefix: MediaQueryPrefixValue.MD, value: AlignItemsCSSValue.START },
  ],
  flexFlow: [{ prefix: MediaQueryPrefixValue.MD, value: FlexFlowCSSValue.ROW }],
};

const webProjectDescriptionContainerResponsiveStyle: FlexContainerProps["responsive"] =
  {
    alignSelf: { prefix: "md", value: AlignItemsCSSValue.BASELINE },
  };

export default function WebProject({
  analytics,
  cloudinaryId,
  alt,
  // cursorStyle = "pointer",
  descriptions,
  // emoji,
  href,
  name,
  width,
  height,
  tagline,
  isLast,
}: WebProjectProps) {
  // // TODO: figure out how to apply this to space clones project on hover.
  // const _cursorStyleProp = useMemo(
  //   () => ({ cursor: cursorStyle }),
  //   [cursorStyle],
  // );

  return (
    <FlexContainer flexFlow={FlexFlowCSSValue.COLUMN} gapY={8}>
      <HeadingTwo>{name}</HeadingTwo>
      <FlexContainer
        gapX={8}
        gapY={4}
        justifyContent={JustifyContentCSSValue.CENTER}
        flexFlow={FlexFlowCSSValue.COLUMN}
        alignItems={AlignItemsCSSValue.CENTER}
        responsive={webProjectContainerResponsiveStyle}
      >
        <FlexContainer
          inline
          flexFlow={FlexFlowCSSValue.COLUMN}
          alignItems={AlignItemsCSSValue.CENTER}
          maxWidth={500}
        >
          <InlineAnchor
            href={getLinkWithAnalytics(href, analytics)}
            ariaLabel={`Navigate to ${name}`}
          >
            <WebProjectImage
              alt={alt}
              publicId={cloudinaryId.dark ?? cloudinaryId.default}
              width={width}
              height={height}
            />
          </InlineAnchor>
          <InlineAnchor
            isExternal
            accent
            ariaLabel={`Navigate to ${name}`}
            href={href}
          >
            <FlexContainer gapX={2}>
              <Paragraph>{tagline}</Paragraph>
            </FlexContainer>
          </InlineAnchor>
        </FlexContainer>
        <FlexContainer
          inline
          flexFlow={FlexFlowCSSValue.COLUMN}
          alignSelf={AlignItemsCSSValue.START}
          responsive={webProjectDescriptionContainerResponsiveStyle}
          gapY={4}
        >
          {descriptions.map((description) => (
            <Paragraph key={description} width="md:w-[25ch] lg:w-fit">
              {description}
            </Paragraph>
          ))}
        </FlexContainer>
      </FlexContainer>
      <RenderIf condition={!isLast}>
        <hr className="line-break" />
      </RenderIf>
    </FlexContainer>
  );
}
