import styles from "./LoadingSpinner.module.css";

export type LoadingSpinnerContainerProps = {
  children: React.ReactNode | Array<React.ReactNode>;
};

export default function LoadingSpinnerContainer({
  children,
}: LoadingSpinnerContainerProps) {
  return <div className={styles["loading-spinner-container"]}>{children}</div>;
}
