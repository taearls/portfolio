import type { TextAlignmentType } from "@/types/layout.ts";
import type { ReactNode } from "react";

import { TextAlignment } from "@/types/layout.ts";
import {
  getTextAlignmentClass,
  mergeClasses,
} from "@/util/styling/styling.utils.ts";

export type ParagraphProps = {
  children: ReactNode | Array<ReactNode>;
  accent?: boolean;
  italic?: boolean;
  /** Use secondary/muted text color for metadata */
  secondary?: boolean;
  width?: string;
  maxWidth?: string;
  alignment?: TextAlignmentType;
  /** Additional CSS classes */
  className?: string;
  "data-testid"?: string;
};

export default function Paragraph({
  "data-testid": testId,
  children,
  accent = false,
  italic = false,
  secondary = false,
  maxWidth = "max-w-65ch",
  width,
  alignment = TextAlignment.LEFT,
  className,
}: ParagraphProps) {
  const alignmentClass = getTextAlignmentClass(alignment);
  return (
    <p
      data-testid={testId}
      className={mergeClasses(
        accent && "accent",
        italic && "italic",
        secondary && "text-secondary-text",
        width != null && width,
        alignmentClass,
        maxWidth,
        "text-lg leading-loose lg:text-xl",
        className != null && className,
      )}
    >
      {children}
    </p>
  );
}
