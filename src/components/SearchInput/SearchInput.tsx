import type { ChangeEvent } from "react";

import { useId, useRef, useState } from "react";

import styles from "./SearchInput.module.css";

export type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search projects...",
  debounceMs = 150,
}: SearchInputProps) {
  const inputId = useId();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // Sync local state when parent value changes (e.g., external clear).
  // This follows React's recommended pattern for adjusting state based on props:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (value !== prevValue) {
    setPrevValue(value);
    if (value === "") {
      setLocalValue("");
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalValue(newValue);

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule debounced onChange
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  const handleClear = () => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLocalValue("");
    onChange("");
  };

  return (
    <div className={styles["search-container"]}>
      <label htmlFor={inputId} className={styles["search-label"]}>
        Search:
      </label>
      <div className={styles["search-input-wrapper"]}>
        <input
          type="text"
          id={inputId}
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={styles["search-input"]}
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className={styles["clear-button"]}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
}
