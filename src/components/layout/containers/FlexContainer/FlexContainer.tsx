import type { FlexContainerProps } from "@/types/FlexContainer.ts";

import {
  getAlignItemsClass,
  getAlignSelfClass,
  getFlexFlowClass,
  getGapClass,
  getJustifyContentClass,
  mergeClasses,
} from "@/util/styling/styling.utils.ts";

export default function FlexContainer({
  flexFlow,
  responsive,
  alignSelf,
  id,
  gapX,
  gapY,
  justifyContent,
  alignItems,
  children,
  inline = false,
  fullWidth = false,
}: FlexContainerProps) {
  const flexFlowClass = getFlexFlowClass(flexFlow, responsive?.flexFlow);
  const alignSelfClass = getAlignSelfClass(alignSelf, responsive?.alignSelf);
  const justifyContentClass = getJustifyContentClass(
    justifyContent,
    responsive?.justifyContent,
  );
  const alignItemsClass = getAlignItemsClass(
    alignItems,
    responsive?.alignItems,
  );
  const gapXClass = getGapClass("x", gapX, responsive?.gapX);
  const gapYClass = getGapClass("y", gapY, responsive?.gapY);

  return (
    <div
      id={id}
      className={mergeClasses(
        inline ? "inline-flex" : "flex",
        fullWidth && "w-full",
        flexFlowClass,
        alignSelfClass != null && alignSelfClass.toString(),
        justifyContentClass != null && justifyContentClass.toString(),
        alignItemsClass != null && alignItemsClass.toString(),
        gapXClass,
        gapYClass,
      )}
    >
      {children}
    </div>
  );
}
