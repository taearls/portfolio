import Link from "next/link";
import { ExternalLinkIcon } from "../icons";

export type InlineAnchorProps = {
  ariaLabel: string;
  href: string;
  text: string;
  isExternal?: boolean;
};

export default function InlineAnchor({
  ariaLabel,
  href,
  text,
  isExternal = false,
}: InlineAnchorProps) {
  return (
    <span className="group inline-block">
      <Link
        href={href}
        aria-label={ariaLabel}
        target={isExternal ? "_blank" : undefined}
      >
        {text}
        {isExternal && (
          <span className="mx-1">
            <ExternalLinkIcon />
          </span>
        )}
      </Link>
    </span>
  );
}
