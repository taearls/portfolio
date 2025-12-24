import styles from "./CountLabel.module.css";

type CountLabelProps = {
  count: number;
  label: {
    /** Label to display when count is 1 (e.g., "PR merged") */
    singular: string;
    /** Label to display when count is not 1 (e.g., "PRs merged") */
    plural: string;
  };
};

export default function CountLabel({ count, label }: CountLabelProps) {
  const displayLabel = count === 1 ? label.singular : label.plural;

  return (
    <p className={styles.countLabel}>
      {count} {displayLabel}
    </p>
  );
}
