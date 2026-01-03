import type { ActionButtonProps } from "./ActionButton.types.ts";

import { useState } from "react";

import styles from "./ActionButton.module.css";

/**
 * ActionButton component with built-in loading state management.
 * Automatically disables the button while an async action is in progress.
 */
export default function ActionButton({
  children,
  onClick,
  isLoading: externalIsLoading = false,
  disabled = false,
  className = "",
  loadingLabel = "Processing...",
  type = "button",
}: ActionButtonProps) {
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  // Use external loading state if provided, otherwise use internal state
  const isLoading = externalIsLoading || internalIsLoading;

  const handleClick = async () => {
    if (isLoading || disabled) {
      return;
    }

    try {
      setInternalIsLoading(true);
      const result = onClick();

      // If onClick returns a promise, wait for it
      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      // Log error for debugging
      // Note: We don't re-throw because async handlers can't be caught by Error Boundaries
      // (Error Boundaries only catch synchronous render errors, not rejected promises)
      console.error("ActionButton: Error during onClick:", error);
    } finally {
      setInternalIsLoading(false);
    }
  };

  const buttonClasses = [
    styles.button,
    className,
    isLoading ? styles.loading : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-label={isLoading ? loadingLabel : undefined}
    >
      {isLoading ? loadingLabel : children}
    </button>
  );
}
