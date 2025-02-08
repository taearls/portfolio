import { useMemo } from "react";

import CloudinaryImage from "@/components/CloudinaryImage/CloudinaryImage.tsx";
import InlineAnchor from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import HeadingTwo from "@/components/layout/headings/HeadingTwo.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
import { WebProjectAnalytics } from "@/types/WebProject.ts";
import { getLinkWithAnalytics } from "@/util/utils.ts";

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
    <div className="mx-auto mt-12">
      <HeadingTwo>{name}</HeadingTwo>
      <div className="mb-8 flow-root">
        <div className="sm:clearfix mx-auto mb-2 w-11/12 text-center sm:float-left sm:mb-0 sm:mr-4 sm:w-1/2">
          <FlexContainer>
            <a
              className="block rounded-sm focus:shadow-outline-light focus:outline-none dark:focus:shadow-outline-dark"
              target="_blank"
              href={getLinkWithAnalytics(href, analytics)}
              rel={analytics != null ? "noopener" : "noreferrer"}
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
            <>
              <Paragraph>{tagline}</Paragraph>
              {emoji != null && <span className="no-underline">{emoji}</span>}
            </>
          </InlineAnchor>
        </div>
        <div>
          {descriptions.map((description) => (
            <Paragraph key={description}>{description}</Paragraph>
          ))}
        </div>
      </div>
      {!isLast && <hr className="line-break" />}
    </div>
  );
}
