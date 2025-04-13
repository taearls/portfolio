import type { JSX } from "react";

import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon.tsx";
import { mergeClasses } from "@/util/styling/styling.utils.ts";

export type InlineAnchorProps = {
  ariaLabel: string;
  href: string;
  children: JSX.Element | string;
  accent?: boolean;
  isExternal?: boolean;
  bold?: boolean;
  noColor?: boolean;
  underline?: boolean;
};

export default function InlineAnchor({
  ariaLabel,
  href,
  children,
  isExternal = false,
  bold = true,
  accent = false,
  underline = true,
}: InlineAnchorProps) {
  return (
    <span className="inline-block">
      <a
        href={href}
        aria-label={ariaLabel}
        target={isExternal ? "_blank" : undefined}
        rel="noreferrer"
      >
        <InlineAnchorContent
          isExternal={isExternal}
          accent={accent}
          bold={bold}
          underline={underline}
        >
          {children}
        </InlineAnchorContent>
      </a>
    </span>
  );
}

export function InlineAnchorContent({
  children,
  isExternal = false,
  bold = true,
  accent = false,
  underline = true,
}: Omit<InlineAnchorProps, "href" | "ariaLabel">) {
  const boldClass = bold ? "font-extrabold" : "font-normal";

  return (
    <span
      className={mergeClasses(
        boldClass,
        accent && "accent",
        "group inline-flex items-center gap-x-1 rounded-sm text-lg focus:shadow-outline-light focus:outline-none sm:items-center sm:justify-center dark:focus:shadow-outline-dark",
      )}
    >
      <span className={mergeClasses(underline && "underline", "inline-flex")}>
        {children}
      </span>
      {isExternal && (
        <span className="inline-flex">
          <ExternalLinkIcon />
        </span>
      )}
    </span>
  );
}
