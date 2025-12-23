import type { HeadingProps } from "@/types/layout.ts";

import { TextAlignment } from "@/types/layout.ts";
import {
  getTextAlignmentClass,
  mergeClasses,
} from "@/util/styling/styling.utils.ts";

export default function HeadingThree({
  children,
  align = TextAlignment.LEFT,
  accent = true,
}: HeadingProps) {
  const alignmentClass = getTextAlignmentClass(align);

  return (
    <h3
      className={mergeClasses(
        alignmentClass,
        accent && "accent",
        "text-2xl font-bold",
      )}
    >
      {children}
    </h3>
  );
}
