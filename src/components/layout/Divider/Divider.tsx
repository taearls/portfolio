import { mergeClasses } from "@/util/styling/styling.utils.ts";
import styles from "./Divider.module.css";

export type DividerOrientation = "horizontal" | "vertical";

export type DividerProps = {
  /** The orientation of the divider */
  orientation?: DividerOrientation;
  /** Additional CSS classes */
  className?: string;
};

/**
 * A visual separator for creating clear boundaries between content sections.
 * Supports both horizontal and vertical orientations.
 *
 * The divider is purely decorative and hidden from screen readers.
 */
export default function Divider({
  orientation = "horizontal",
  className,
}: DividerProps) {
  return (
    <div
      className={mergeClasses(
        styles.divider,
        orientation === "vertical" ? styles.vertical : styles.horizontal,
        className,
      )}
      aria-hidden="true"
    />
  );
}
