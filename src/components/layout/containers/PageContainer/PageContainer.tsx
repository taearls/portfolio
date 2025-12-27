import type { ReactNode } from "react";

import { useState } from "react";
import { useLocation } from "react-router";

import useWindowResize from "@/hooks/useWindowResize.ts";
import { checkNavHeight } from "@/state/machines/navigationMachine.ts";
import styles from "./PageContainer.module.css";

export type PageContainerProps = {
  children: ReactNode | Array<ReactNode>;
};

export default function PageContainer({ children }: PageContainerProps) {
  const location = useLocation();
  // Capture initial pathname on mount - never changes after initial render
  const [initialPathname] = useState(() => location.pathname);

  useWindowResize(() => {
    checkNavHeight();
  }, []);

  // Show animation only after navigating away from initial page
  // This avoids choppy animation during initial hydration
  const hasNavigated = location.pathname !== initialPathname;

  // height of page container controlled in NavigationBar via navigationMachine
  return (
    <div
      id="page-container"
      className={`${styles["page-container"]} top-0 mx-auto w-full bg-none px-8 py-4 leading-8 sm:px-12 md:px-24`}
    >
      {/* Key forces remount on navigation, triggering animation */}
      {/* Skip animation on initial page to avoid choppy initial load */}
      <div
        key={location.pathname}
        className={hasNavigated ? styles["page-content"] : undefined}
      >
        {children}
      </div>
    </div>
  );
}
