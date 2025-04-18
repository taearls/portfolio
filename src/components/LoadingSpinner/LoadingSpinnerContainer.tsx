import type { ReactNode } from "react";

import styles from "./LoadingSpinner.module.css";

export type LoadingSpinnerContainerProps = {
  children: ReactNode | Array<ReactNode>;
};

export default function LoadingSpinnerContainer({
  children,
}: LoadingSpinnerContainerProps) {
  return <div className={styles["loading-spinner-container"]}>{children}</div>;
}
