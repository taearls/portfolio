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
      <a
        className={
          "focus:shadow-outline-light dark:focus:shadow-outline-dark inline-block rounded-sm text-lg font-extrabold text-purple-700 focus:outline-none group-hover:text-cyan-400 sm:items-center sm:justify-center dark:text-purple-400 dark:group-hover:text-cyan-300"
        }
        aria-label={ariaLabel}
        target={isExternal ? "_blank" : "_self"}
        href={href}
      >
        <span>{text}</span>
        {isExternal && <ExternalLinkIcon />}
      </a>
    </span>
  );
}
