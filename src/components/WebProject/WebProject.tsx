import { useMemo } from "react";

import CloudinaryImage from "@/components/CloudinaryImage/CloudinaryImage.tsx";
import HeadingTwo from "@/components/layout/headings/HeadingTwo.tsx";
import Paragraph from "@/components/layout/Paragraph/Paragraph.tsx";
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

export type WebProjectAnalytics = {
  campaign: string;
  medium: string;
  source: string;
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
          <div className="flex justify-center">
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
          </div>
          <a
            className="mt-1 block cursor-pointer rounded-sm font-semibold text-purple-700 focus:shadow-outline-light focus:outline-none dark:text-purple-400 dark:focus:shadow-outline-dark"
            target="_blank"
            rel="noreferrer"
            href={href}
          >
            <span className="text-purple-700 md:text-lg dark:text-purple-400">
              {tagline}
            </span>
            {emoji != null && <span>{emoji}</span>}
          </a>
        </div>
        <div>
          {descriptions.map((description, index) => (
            <Paragraph key={index}>{description}</Paragraph>
          ))}
        </div>
      </div>
      {!isLast && <hr className="line-break" />}
    </div>
  );
}
