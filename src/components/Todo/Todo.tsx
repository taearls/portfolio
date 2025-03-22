import type { CSSProperties, ReactNode } from "react";

import { Fragment } from "react";

import { mergeClasses } from "@/util/styling/styling.utils.ts";
import RenderIf from "../layout/RenderIf";

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
        className={mergeClasses("text-current", className != null && className)}
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
