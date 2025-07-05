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
  ariaLabel = `Go to ${name}`,
  accent = true,
  href,
  icon,
}: SocialMediaIconProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={mergeClasses(
        styles["icon-base"],
        styles["icon"],
        accent && "accent",
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="rounded-sm">{icon}</span>
    </a>
  );
}
