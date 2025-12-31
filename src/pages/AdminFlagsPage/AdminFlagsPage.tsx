import type { FeatureFlags } from "@/types/featureFlags.ts";

import { useState } from "react";

import FlagStatusBadge from "@/components/FlagStatusBadge/FlagStatusBadge.tsx";
import { useFeatureFlags } from "@/hooks/useFeatureFlags.ts";
import { FLAG_METADATA } from "@/types/featureFlags.ts";
import styles from "./AdminFlagsPage.module.css";

export default function AdminFlagsPage() {
  const { flags, isLoading, error, refetch } = useFeatureFlags();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const flagEntries = Object.entries(flags) as Array<
    [keyof FeatureFlags, FeatureFlags[keyof FeatureFlags]]
  >;

  if (isLoading && !lastRefresh) {
    return (
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Feature Flags</h1>
        </div>
        <div className={styles["loading-container"]}>
          <p>Loading feature flags...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Feature Flags</h1>
        <button
          type="button"
          className={styles["refresh-button"]}
          onClick={handleRefresh}
          disabled={isRefreshing}
          aria-label="Refresh feature flags"
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className={styles["error-container"]}>
          <p className={styles["error-message"]}>
            Failed to load flags: {error.message}
          </p>
          <button
            type="button"
            className={styles["refresh-button"]}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            Try Again
          </button>
        </div>
      )}

      {!error && flagEntries.length === 0 && (
        <div className={styles["empty-state"]}>
          <p>No feature flags configured.</p>
        </div>
      )}

      {!error && flagEntries.length > 0 && (
        <div className={styles["table-container"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Flag</th>
                <th scope="col">Status</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {flagEntries.map(([key, value]) => {
                const metadata = FLAG_METADATA[key];
                return (
                  <tr key={key}>
                    <td>
                      <span className={styles["flag-name"]}>{key}</span>
                    </td>
                    <td>
                      <FlagStatusBadge enabled={value.enabled} />
                    </td>
                    <td>
                      <span className={styles["flag-description"]}>
                        {metadata?.description ?? "No description available"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles["status-bar"]}>
        <span
          className={`${styles["status-dot"]} ${error ? styles["status-dot-error"] : ""}`}
          aria-hidden="true"
        />
        <span>
          {error
            ? "Connection error"
            : lastRefresh
              ? `Last updated: ${lastRefresh.toLocaleTimeString()}`
              : "Connected to feature flags API"}
        </span>
      </div>
    </main>
  );
}
