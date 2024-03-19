import { HeadingProps } from "./types";
import { getAlignmentClass } from "./util";

export default function HeadingTwo({
  children,
  align = "center",
}: HeadingProps) {
  const alignmentClass = getAlignmentClass(align);

  return (
    <h2
      className={`${alignmentClass} mb-8 text-3xl font-bold text-purple-700 dark:text-purple-400`}
    >
      {children}
    </h2>
  );
}
