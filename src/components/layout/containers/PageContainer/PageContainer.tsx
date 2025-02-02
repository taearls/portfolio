import { ReactNode } from "react";

import useWindowResize from "@/hooks/useWindowResize.ts";
import { checkNavHeight } from "@/state/navigationMachine.ts";
import styles from "./PageContainer.module.css";

export type PageContainerProps = {
  children: ReactNode | Array<ReactNode>;
};

export default function PageContainer({ children }: PageContainerProps) {
  useWindowResize(checkNavHeight, []);

  // height of page container controlled in NavigationBar via navigationMachine
  return (
    <div
      id="page-container"
      className={`${styles["page-container"]} top-0 mx-auto w-full bg-none px-8 py-4 leading-8 sm:px-12 md:px-24`}
    >
      {children}
    </div>
  );
}
