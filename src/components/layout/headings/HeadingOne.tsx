import { HeadingProps, TextAlignment } from "@/types/layout.ts";
import {
  getTextAlignmentClass,
  mergeClasses,
} from "@/util/styling/styling.utils.ts";

export default function HeadingOne({
  children,
  align = TextAlignment.CENTER,
  accent = true,
}: HeadingProps) {
  const alignmentClass = getTextAlignmentClass(align);
  return (
    <h1
      className={mergeClasses(
        alignmentClass,
        accent && "accent",
        "text-4xl font-extrabold",
      )}
    >
      {children}
    </h1>
  );
}
