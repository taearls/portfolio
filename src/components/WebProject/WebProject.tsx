import type { WebProjectAnalytics } from "@/types/WebProject.ts";

import { Fragment, useMemo } from "react";

import CloudinaryImage from "@/components/CloudinaryImage/CloudinaryImage.tsx";
import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingTwo from "@/components/layout/headings/HeadingTwo.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import { getLinkWithAnalytics } from "@/util/utils.ts";
import RenderIf from "../layout/RenderIf.tsx";

export type WebProjectProps = {
  analytics?: WebProjectAnalytics;
  cloudinaryId: string;
  // TODO: remove this prop
  imageExtension: string;
  alt: string;
  cursorStyle?: string;
  descriptions: Array<string>;
  emoji?: string;
  href: string;
  name: string;
  tagline: string;
  isLast: boolean;
};

export default function WebProject({
  analytics,
  cloudinaryId,
  alt,
  cursorStyle = "pointer",
  descriptions,
  emoji,
  href,
  name,
  tagline,
  isLast,
}: WebProjectProps) {
  const cursorStyleProp = useMemo(
    () => ({ cursor: cursorStyle }),
    [cursorStyle],
  );

  return (
    <FlexContainer>
      <HeadingTwo>{name}</HeadingTwo>
      <FlexContainer>
        <FlexContainer>
          <FlexContainer>
            <a
              className="block rounded-sm focus:shadow-outline-light focus:outline-none dark:focus:shadow-outline-dark"
              target="_blank"
              href={getLinkWithAnalytics(href, analytics)}
              rel={"noreferrer"}
              style={cursorStyleProp}
            >
              <CloudinaryImage
                alt={alt}
                publicId={cloudinaryId}
                width={400}
                height={400}
              />
            </a>
          </FlexContainer>
          <InlineAnchor
            isExternal
            accent
            ariaLabel={`Navigate to ${name}`}
            href={href}
          >
            <Fragment key={href}>
              <Paragraph>{tagline}</Paragraph>
              {emoji != null && <span className="no-underline">{emoji}</span>}
            </Fragment>
          </InlineAnchor>
        </FlexContainer>
        <FlexContainer>
          {descriptions.map((description) => (
            <Paragraph key={description}>{description}</Paragraph>
          ))}
        </FlexContainer>
      </FlexContainer>
      <RenderIf condition={isLast}>
        <hr className="line-break" />
      </RenderIf>
    </FlexContainer>
  );
}
