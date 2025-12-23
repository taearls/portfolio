import type { ChangeEvent } from "react";

import styles from "./SearchInput.module.css";

export type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search projects...",
  ariaLabel = "Search projects",
}: SearchInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={styles["search-container"]}>
      <label htmlFor="project-search" className={styles["search-label"]}>
        Search:
      </label>
      <div className={styles["search-input-wrapper"]}>
        <input
          type="text"
          id="project-search"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={styles["search-input"]}
        />
        {value && (
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
