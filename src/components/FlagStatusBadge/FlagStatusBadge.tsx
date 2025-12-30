import { mergeClasses } from "@/util/styling/styling.utils.ts";
import styles from "./FlagStatusBadge.module.css";

export type FlagStatusBadgeProps = {
  enabled: boolean;
};

export default function FlagStatusBadge({ enabled }: FlagStatusBadgeProps) {
  const badgeClass = mergeClasses(
    styles.badge,
    enabled ? styles["badge-enabled"] : styles["badge-disabled"],
  );

  const indicatorClass = mergeClasses(
    styles.indicator,
    enabled ? styles["indicator-enabled"] : styles["indicator-disabled"],
  );

  return (
    <span
      className={badgeClass}
      role="status"
      aria-label={enabled ? "Enabled" : "Disabled"}
    >
      <span className={indicatorClass} aria-hidden="true" />
      {enabled ? "Enabled" : "Disabled"}
    </span>
  );
}
