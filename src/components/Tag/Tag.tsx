import { mergeClasses } from "@/util/styling/styling.utils.ts";
import styles from "./Tag.module.css";

export type TagProps = {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function Tag({ label, isSelected = false, onClick }: TagProps) {
  const className = mergeClasses(
    styles.tag,
    isSelected && styles["tag-selected"],
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={className}
        aria-pressed={isSelected}
        aria-label={`Filter by ${label}`}
      >
        {label}
      </button>
    );
  }

  return <span className={className}>{label}</span>;
}
