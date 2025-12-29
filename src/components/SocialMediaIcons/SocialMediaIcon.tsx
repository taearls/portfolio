import type { ReactNode } from "react";

import { mergeClasses } from "@/util/styling/styling.utils.ts";
import styles from "./SocialMediaIcon.module.css";

export type SocialMediaIconProps = {
  name: string;
  href: string;
  ariaLabel?: string;
  accent?: boolean;
  icon: ReactNode;
};

export default function SocialMediaIcon({
  name,
  ariaLabel,
  accent = true,
  href,
  icon,
}: SocialMediaIconProps) {
  const resolvedAriaLabel = ariaLabel ?? `Go to ${name}`;
  return (
    <a
      href={href}
      aria-label={resolvedAriaLabel}
      className={mergeClasses(
        styles["icon-base"],
        styles["icon"],
        accent && "accent",
      )}
      target="_blank"
      rel="noreferrer"
    >
      <span className="rounded-sm">{icon}</span>
    </a>
  );
}
