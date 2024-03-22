import Link from "next/link";
import { ExternalLinkIcon } from "../icons";

export type InlineAnchorProps = {
  ariaLabel: string;
  href: string;
  text: string;
  isExternal?: boolean;
  bold?: boolean;
  noColor?: boolean;
};

export default function InlineAnchor({
  ariaLabel,
  href,
  text,
  isExternal = false,
  bold = true,
  noColor = false,
}: InlineAnchorProps) {
  const boldClass = bold ? "font-extrabold" : "font-normal";
  const colorClass = noColor
    ? "text-soft-black dark:text-white"
    : "text-purple-700 dark:text-purple-400";
  return (
    <span className="group inline-block">
      <Link
        className={`${boldClass} focus:shadow-outline-light dark:focus:shadow-outline-dark group inline-flex items-center rounded-sm  text-lg focus:outline-none sm:items-center sm:justify-center`}
        href={href}
        aria-label={ariaLabel}
        target={isExternal ? "_blank" : undefined}
      >
        <span
          className={`${colorClass} inline-flex group-hover:text-cyan-400  dark:group-hover:text-cyan-300`}
        >
          {text}
        </span>
        {isExternal && (
          <span className="ml-1 inline-flex">
            <ExternalLinkIcon noColor={noColor} />
          </span>
        )}
      </Link>
    </span>
  );
}
