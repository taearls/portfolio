import type { ReactNode } from "react";

export interface ActionButtonProps {
  /**
   * Button label text
   */
  children: ReactNode;

  /**
   * Click handler for the button
   */
  onClick: () => void | Promise<void>;

  /**
   * Whether the button is currently in a loading state
   */
  isLoading?: boolean;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Optional additional CSS class names
   */
  className?: string;

  /**
   * Accessible label for screen readers when in loading state
   */
  loadingLabel?: string;

  /**
   * Button type attribute
   */
  type?: "button" | "submit" | "reset";
}
