import { forwardRef } from "react";

import { mergeClasses } from "@/util/styling/styling.utils.ts";
import styles from "./NavigationToggle.module.css";

export type NavigationToggleProps = {
  active: boolean;
  onClick: () => void;
};

const NavigationToggle = forwardRef<HTMLButtonElement, NavigationToggleProps>(
  function NavigationToggle({ active, onClick }, ref) {
    return (
      <button
        ref={ref}
        id={styles["custom-toggler"]}
        className={mergeClasses(active && styles["active"])}
        aria-label={`${active ? "Close Navigation" : "Open Navigation"}`}
        onClick={onClick}
      >
        <div id={styles["toggler-top"]} />
        <div id={styles["toggler-middle"]} />
        <div id={styles["toggler-bottom"]} />
      </button>
    );
  },
);

export default NavigationToggle;
