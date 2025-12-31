import type { ErrorInfo, ReactNode, RefObject } from "react";

import { Component, createRef } from "react";

import styles from "./ErrorBoundary.module.css";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to catch runtime errors in child components.
 * Displays a friendly fallback UI and logs errors for debugging.
 * Includes accessibility features: ARIA live region and focus management.
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private headingRef: RefObject<HTMLHeadingElement | null>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.headingRef = createRef();
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidUpdate(
    _prevProps: ErrorBoundaryProps,
    prevState: ErrorBoundaryState,
  ): void {
    // Move focus to heading when error state is entered
    if (this.state.hasError && !prevState.hasError && this.headingRef.current) {
      this.headingRef.current.focus();
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  /**
   * Get a user-friendly error message.
   * In production, avoid exposing internal error details.
   */
  private getDisplayMessage(): string {
    if (!this.state.error) {
      return "";
    }
    // For this portfolio site, showing error messages is acceptable for debugging.
    // In a production app with sensitive data, consider:
    // return process.env.NODE_ENV === 'production' ? 'An error occurred' : this.state.error.message;
    return this.state.error.message;
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.container} role="alert" aria-live="assertive">
          <div className={styles.content}>
            <h2 ref={this.headingRef} className={styles.title} tabIndex={-1}>
              Something went wrong
            </h2>
            <p className={styles.message}>
              An unexpected error occurred. Please try again.
            </p>
            {this.state.error && (
              <p className={styles.details}>{this.getDisplayMessage()}</p>
            )}
            <button
              type="button"
              className={styles.button}
              onClick={this.handleReset}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
