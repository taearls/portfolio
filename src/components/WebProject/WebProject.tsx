import { CloudinaryImage } from "../CloudinaryImage";
import { Paragraph } from "../layout/Paragraph";
import { HeadingTwo } from "../layout/headings";
import { getLinkWithAnalytics } from "@/util";

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
              className="focus:shadow-outline-light dark:focus:shadow-outline-dark block rounded-sm focus:outline-none"
              target="_blank"
              href={getLinkWithAnalytics(href, analytics)}
              rel={analytics != null ? "noopener" : "noreferrer"}
              style={{ cursor: cursorStyle }}
            >
              <CloudinaryImage
                alt={alt}
                publicId={cloudinaryId}
                extension={imageExtension}
                transformations={["q_auto", "w_400"]}
                width={400}
                height={400}
              />
            </a>
          </div>
          <a
            className="focus:shadow-outline-light dark:focus:shadow-outline-dark mt-1 block cursor-pointer rounded-sm font-semibold text-purple-700 focus:outline-none dark:text-purple-400"
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
