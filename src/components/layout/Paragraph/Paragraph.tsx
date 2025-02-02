import { TextAlignment, TextAlignmentType } from "@/types/layout.ts";
import {
  getTextAlignmentClass,
  mergeClasses,
} from "@/util/styling/styling.utils.ts";

export type ParagraphProps = {
  children: React.ReactNode | Array<React.ReactNode>;
  accent?: boolean;
  italic?: boolean;
  width?: string;
  alignment?: TextAlignmentType;
  "data-testid"?: string;
};

export default function Paragraph({
  "data-testid": testId,
  children,
  accent = false,
  italic = false,
  width,
  alignment = TextAlignment.LEFT,
}: ParagraphProps) {
  const alignmentClass = getTextAlignmentClass(alignment);
  return (
    <p
      data-testid={testId}
      className={mergeClasses(
        accent && "accent",
        italic && "italic",
        width != null && width,
        alignmentClass,
        "max-w-65ch text-lg leading-normal md:text-xl",
      )}
    >
      {children}
    </p>
  );
}
