import { getLinkWithAnalytics } from "@/util";
import CloudinaryImage from "../CloudinaryImage/CloudinaryImage";
import HeadingTwo from "../layout/headings/HeadingTwo";
import Paragraph from "../layout/Paragraph/Paragraph";

export type WebProjectProps = {
  analytics?: WebProjectAnalytics;
  cloudinaryId: string;
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
  imageExtension,
  alt,
  cursorStyle = "pointer",
  descriptions,
  emoji,
  href,
  name,
  tagline,
  isLast,
}: WebProjectProps) {
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
              style={{ cursor: cursorStyle }}
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
