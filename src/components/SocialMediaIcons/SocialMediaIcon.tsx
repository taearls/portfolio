import { ReactNode } from "react";

import { mergeClasses } from "@/util/styling/styling.utils";
import styles from "./SocialMediaIcon.module.css";

export type SocialMediaIconProps = {
  name: string;
  href: string;
  ariaLabel?: string;
  icon: ReactNode;
};

export default function SocialMediaIcon({
  name,
  ariaLabel = `Go to Cuckoo and the Birds's ${name}`,
  href,
  icon,
}: SocialMediaIconProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={mergeClasses(styles["icon-base"], styles["icon"], "accent")}
      target="_blank"
      rel="noreferrer"
    >
      <span className="rounded-sm">{icon}</span>
    </a>
  );
}
