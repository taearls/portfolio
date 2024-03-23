// import styles from "./LoadingSpinner.module.css";

export type LoadingSpinnerContainerProps = {
  children: React.ReactNode | React.ReactNode[];
};

export default function LoadingSpinnerContainer({
  children,
}: LoadingSpinnerContainerProps) {
  // return <div className={styles["loading-spinner-container"]}>{children}</div>;
  return <div>{children}</div>;
}
