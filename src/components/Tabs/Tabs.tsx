import type { KeyboardEvent, ReactNode } from "react";

import { useCallback, useId, useState } from "react";
import { useSearchParams } from "react-router";

import styles from "./Tabs.module.css";

export type Tab = {
  id: string;
  label: string;
  children: ReactNode;
};

type TabsProps = {
  tabs: Array<Tab>;
  defaultTabId?: string;
  ariaLabel?: string;
  /** Query parameter name for URL sync. If provided, tab state syncs with URL. */
  queryParam?: string;
};

export default function Tabs({
  tabs,
  defaultTabId,
  ariaLabel = "Content tabs",
  queryParam,
}: TabsProps) {
  const uniqueId = useId();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localActiveTabId, setLocalActiveTabId] = useState(
    defaultTabId ?? tabs[0]?.id ?? "",
  );

  // Determine active tab from URL (if queryParam provided) or local state
  const validTabIds = tabs.map((t) => t.id);
  const tabFromUrl = queryParam ? searchParams.get(queryParam) : null;

  const activeTabId = queryParam
    ? tabFromUrl && validTabIds.includes(tabFromUrl)
      ? tabFromUrl
      : (defaultTabId ?? tabs[0]?.id ?? "")
    : localActiveTabId;

  const setActiveTabId = useCallback(
    (tabId: string) => {
      if (queryParam) {
        setSearchParams(
          (prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set(queryParam, tabId);
            return newParams;
          },
          { replace: true },
        );
      } else {
        setLocalActiveTabId(tabId);
      }
    },
    [queryParam, setSearchParams],
  );

  const getTabId = useCallback(
    (tabId: string) => `${uniqueId}-tab-${tabId}`,
    [uniqueId],
  );

  const getPanelId = useCallback(
    (tabId: string) => `${uniqueId}-panel-${tabId}`,
    [uniqueId],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId);
      let newIndex = currentIndex;

      switch (event.key) {
        case "ArrowLeft":
          newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
          break;
        case "ArrowRight":
          newIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
          break;
        case "Home":
          newIndex = 0;
          break;
        case "End":
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const newTabId = tabs[newIndex]?.id;
      if (newTabId) {
        setActiveTabId(newTabId);
        // Focus the new tab button
        const tabButton = document.getElementById(getTabId(newTabId));
        tabButton?.focus();
      }
    },
    [tabs, activeTabId, getTabId, setActiveTabId],
  );

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className={styles.tabsContainer}>
      <div role="tablist" aria-label={ariaLabel} className={styles.tabList}>
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              id={getTabId(tab.id)}
              role="tab"
              aria-selected={isActive}
              aria-controls={getPanelId(tab.id)}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTabId(tab.id)}
              onKeyDown={handleKeyDown}
              className={styles.tab}
              style={
                {
                  "--tab-index": index,
                } as React.CSSProperties
              }
              data-active={isActive || undefined}
            >
              {tab.label}
            </button>
          );
        })}
        {/* Sliding indicator */}
        <div
          className={styles.indicator}
          style={
            {
              "--active-index": tabs.findIndex((t) => t.id === activeTabId),
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
      </div>

      {/* Tab panels */}
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            id={getPanelId(tab.id)}
            role="tabpanel"
            aria-labelledby={getTabId(tab.id)}
            tabIndex={0}
            className={styles.tabPanel}
            hidden={!isActive}
          >
            {isActive && tab.children}
          </div>
        );
      })}

      {/* Screen reader announcement for tab changes */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {activeTab && `${activeTab.label} tab selected`}
      </div>
    </div>
  );
}
