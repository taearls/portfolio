import { ReactNode } from "react";

export const TextAlignment = {
  CENTER: "center",
  LEFT: "left",
  RIGHT: "right",
} as const;

export type TextAlignmentType =
  (typeof TextAlignment)[keyof typeof TextAlignment];

export const JustifyContentCSSValue = {
  CENTER: "center",
  END: "flex-end",
  NORMAL: "normal",
  SPACE_AROUND: "space-around",
  SPACE_BETWEEN: "space-between",
  SPACE_EVENLY: "space-evenly",
  START: "flex-start",
  STRETCH: "stretch",
} as const satisfies Record<string, string>;

export const AlignItemsCSSValue = {
  BASELINE: "baseline",
  CENTER: "center",
  END: "end",
  START: "start",
  STRETCH: "stretch",
} as const satisfies Record<string, string>;

export type GapCSSType = {
  direction: "x" | "y";
  // https://github.com/microsoft/TypeScript/issues/54925
  value?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};

export type JustifyContentCSSType =
  (typeof JustifyContentCSSValue)[keyof typeof JustifyContentCSSValue];

export type AlignItemsCSSType =
  (typeof AlignItemsCSSValue)[keyof typeof AlignItemsCSSValue];

export const FlexFlowCSSValue = {
  COLUMN: "column",
  ROW: "row",
} as const satisfies Record<string, string>;
export type FlexFlowCSSType =
  (typeof FlexFlowCSSValue)[keyof typeof FlexFlowCSSValue];

export const MediaQueryPrefixValue = {
  LG: "lg",
  MD: "md",
  SM: "sm",
  XL: "xl",
  XXL: "2xl",
} as const satisfies Record<string, string>;

// https://tailwindcss.com/docs/responsive-design
export type MediaQueryPrefix =
  (typeof MediaQueryPrefixValue)[keyof typeof MediaQueryPrefixValue];

export type ResponsiveValue<T> = { prefix: MediaQueryPrefix; value: T };

export type HeadingProps = {
  children: ReactNode | Array<ReactNode>;
  align?: TextAlignmentType;
  accent?: boolean;
};
