import type { ReactElement } from "react";
import type {
  AlignItemsCSSType,
  FlexFlowCSSType,
  GapCSSType,
  JustifyContentCSSType,
  ResponsiveValue,
} from "./layout.ts";

export type FlexContainerProps = {
  inline?: boolean;
  flexFlow?: FlexFlowCSSType;
  responsive?: {
    flexFlow?:
      | Array<ResponsiveValue<FlexFlowCSSType>>
      | ResponsiveValue<FlexFlowCSSType>;
    gapX?:
      | Array<ResponsiveValue<GapCSSType["value"]>>
      | ResponsiveValue<GapCSSType["value"]>;
    gapY?:
      | Array<ResponsiveValue<GapCSSType["value"]>>
      | ResponsiveValue<GapCSSType["value"]>;
    justifyContent?:
      | Array<ResponsiveValue<JustifyContentCSSType>>
      | ResponsiveValue<JustifyContentCSSType>;
    alignItems?:
      | Array<ResponsiveValue<AlignItemsCSSType>>
      | ResponsiveValue<AlignItemsCSSType>;
  };
  id?: string;
  gapX?: GapCSSType["value"];
  gapY?: GapCSSType["value"];
  justifyContent?: JustifyContentCSSType;
  alignItems?: AlignItemsCSSType;
  children: ReactElement | Array<ReactElement>;
  fullWidth?: boolean;
};
