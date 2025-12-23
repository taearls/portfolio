import type { CSSProperties, PropsWithChildren } from "react";
import type {
  AlignItemsCSSType,
  FlexFlowCSSType,
  GapCSSType,
  JustifyContentCSSType,
  ResponsiveValue,
} from "./layout.ts";

type ResponsiveFlexContainerProp<T> =
  | Array<ResponsiveValue<T>>
  | ResponsiveValue<T>;

export type FlexContainerProps = PropsWithChildren<{
  inline?: boolean;
  flexFlow?: FlexFlowCSSType;
  wrap?: boolean;
  responsive?: {
    flexFlow?: ResponsiveFlexContainerProp<FlexFlowCSSType>;
    gapX?: ResponsiveFlexContainerProp<GapCSSType["value"]>;
    gapY?: ResponsiveFlexContainerProp<GapCSSType["value"]>;
    justifyContent?: ResponsiveFlexContainerProp<JustifyContentCSSType>;
    alignItems?: ResponsiveFlexContainerProp<AlignItemsCSSType>;
    alignSelf?: ResponsiveFlexContainerProp<AlignItemsCSSType>;
  };
  id?: string;
  gapX?: GapCSSType["value"];
  gapY?: GapCSSType["value"];
  justifyContent?: JustifyContentCSSType;
  alignSelf?: AlignItemsCSSType;
  alignItems?: AlignItemsCSSType;
  maxWidth?: CSSProperties["maxWidth"];
  fullWidth?: boolean;
}>;
