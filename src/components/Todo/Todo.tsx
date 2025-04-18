import type { CSSProperties, ReactNode } from "react";

import { Fragment } from "react";

import { mergeClasses } from "@/util/styling/styling.utils.ts";
import RenderIf from "../layout/RenderIf.tsx";

export type TodoProps = {
  description: string;
  className?: string;
  children?: ReactNode | Array<ReactNode>;
};

const descriptionStyle: CSSProperties = { borderRadius: "inherit" };

export default function Todo({ children, description, className }: TodoProps) {
  return (
    <RenderIf condition={import.meta.env.MODE === "development"}>
      <div
        className={mergeClasses(
          "h-[500px] w-[500px] rounded-md bg-pink-500 text-2xl font-bold text-current dark:bg-pink-400 dark:text-soft-black",
          className != null && className,
        )}
      >
        <Fragment>
          {/* cursive font?? */} {children}
          <p
            className="border-inherit bg-inherit italic text-inherit"
            style={descriptionStyle}
          >
            {description}
          </p>
        </Fragment>
      </div>
    </RenderIf>
  );
}
