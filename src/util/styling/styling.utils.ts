import { FlexContainerProps } from "@/types/FlexContainer.ts";
import {
  AlignItemsCSSType,
  AlignItemsCSSValue,
  FlexFlowCSSType,
  FlexFlowCSSValue,
  GapCSSType,
  JustifyContentCSSType,
  JustifyContentCSSValue,
  MediaQueryPrefix,
  TextAlignment,
  TextAlignmentType,
} from "@/types/layout.ts";
import { intoArray } from "@/util/utils.ts";

/**
 * Helper function that merges an unknown amount of classes into a single string. this helps with readability both in code and in the DOM.
 * The classes arg accepts a boolean so that we can
 * @param classes - a list of classes to be merged together
 * @returns a string merging classes together
 */
export const mergeClasses = (...classes: Array<string | boolean>): string => {
  return classes
    .filter((aClass) => typeof aClass === "string" && aClass !== "")
    .join(" ");
};

/**
 * Helper function to get a text-alignment class based on the TextAlignmentType passed in.
 * @param alignment - the alignment we want for the text
 * @returns a CSS class that will align the text
 */
export const getTextAlignmentClass = (alignment: TextAlignmentType): string => {
  switch (alignment) {
    case TextAlignment.LEFT: {
      return "text-left";
    }
    case TextAlignment.CENTER: {
      return "text-center";
    }
    case TextAlignment.RIGHT:
      return "text-right";
  }
};

/**
 * Helper function to get a justify content class based on the JustifyContentCSSType passed in. If a responsive value is passed, it will be merged into the resulting class.
 * @param val - the justify content css type used to determine the base (non-responsive) class
 * @param responsive - an optional responsive value which will build the responsive classes to append to the resulting class
 * @returns a justify content css class
 */
export const getJustifyContentClass = (
  val?: JustifyContentCSSType,
  responsive?: NonNullable<FlexContainerProps["responsive"]>["justifyContent"],
): string => {
  const justifyTransform = (classToTransform: string | undefined) => {
    let result = "";
    // https://tailwindcss.com/docs/justify-content
    switch (classToTransform) {
      case JustifyContentCSSValue.CENTER:
        result = "justify-center";
        break;
      case JustifyContentCSSValue.END:
        result = "justify-end";
        break;
      case JustifyContentCSSValue.NORMAL:
        result = "justify-normal";
        break;
      case JustifyContentCSSValue.SPACE_AROUND:
        result = "justify-around";
        break;
      case JustifyContentCSSValue.SPACE_BETWEEN:
        result = "justify-between";
        break;
      case JustifyContentCSSValue.SPACE_EVENLY:
        result = "justify-evenly";
        break;
      case JustifyContentCSSValue.START:
        result = "justify-start";
        break;
      case JustifyContentCSSValue.STRETCH:
        result = "justify-stretch";
        break;
    }

    return result;
  };

  const baseClass = justifyTransform(val);
  const array = intoArray(responsive);
  const responsiveClasses =
    array?.map((responsiveValue) => {
      const responsiveBaseClass = justifyTransform(responsiveValue.value);

      return getResponsiveClass(responsiveValue.prefix, responsiveBaseClass);
    }) || [];

  return combineBaseAndResponsiveClasses(baseClass, responsiveClasses);
};

/**
 * Helper function to get a align items class based on the AlignItemsCSSType passed in. If a responsive value is passed, it will be merged into the resulting class.
 * @param val - the align items css type used to determine the base (non-responsive) class
 * @param responsive - an optional responsive value which will build the responsive classes to append to the resulting class
 * @returns an align items css class
 */
export const getAlignItemsClass = (
  val?: AlignItemsCSSType,
  responsive?: NonNullable<FlexContainerProps["responsive"]>["alignItems"],
): string => {
  const alignItemsTransform = (
    classToTransform: string | undefined,
  ): string => {
    let result = "";
    switch (classToTransform) {
      case AlignItemsCSSValue.BASELINE:
        result = "items-baseline";
        break;
      case AlignItemsCSSValue.CENTER:
        result = "items-center";
        break;
      case AlignItemsCSSValue.END:
        result = "items-end";
        break;
      case AlignItemsCSSValue.START:
        result = "items-start";
        break;
      case AlignItemsCSSValue.STRETCH:
        result = "items-stretch";
        break;
    }

    return result;
  };

  const baseClass = alignItemsTransform(val);
  const array = intoArray(responsive);
  const responsiveClasses =
    array.map((responsiveValue) => {
      const responsiveBaseClass = alignItemsTransform(responsiveValue.value);

      return getResponsiveClass(responsiveValue.prefix, responsiveBaseClass);
    }) || [];

  return combineBaseAndResponsiveClasses(baseClass, responsiveClasses);
};

/**
 * Helper function to get a flex flow class based on the FlexFlowCSSType passed in. If a responsive value is passed, it will be merged into the resulting class.
 * @param val - the flex flow css type used to determine the base (non-responsive) class
 * @param responsive - an optional responsive value which will build the responsive classes to append to the resulting class
 * @returns a flex flow css class
 */
export const getFlexFlowClass = (
  val?: FlexFlowCSSType,
  responsive?: NonNullable<FlexContainerProps["responsive"]>["flexFlow"],
) => {
  const baseClass =
    val == null
      ? ""
      : val === FlexFlowCSSValue.COLUMN
        ? "flex-col"
        : "flex-row";
  const array = intoArray(responsive);

  const responsiveClasses =
    array.map((responsiveValue) => {
      const responsiveBaseClass =
        responsiveValue.value === FlexFlowCSSValue.COLUMN
          ? "flex-col"
          : "flex-row";

      return getResponsiveClass(responsiveValue.prefix, responsiveBaseClass);
    }) || [];

  return combineBaseAndResponsiveClasses(baseClass, responsiveClasses);
};

/**
 * Helper function to get a gap class based on the GapCSSType passed in. If a responsive value is passed, it will be merged into the resulting class.
 * @param direction - the direction of the gap class we want
 * @param val - the gap css type used to determine the base (non-responsive) class
 * @param responsive - an optional responsive value which will build the responsive classes to append to the resulting class
 * @returns a gap css class
 */
export const getGapClass = (
  direction: GapCSSType["direction"],
  val?: GapCSSType["value"],
  responsive?:
    | NonNullable<FlexContainerProps["responsive"]>["gapX"]
    | NonNullable<FlexContainerProps["responsive"]>["gapY"],
) => {
  const baseClass = val != null ? `gap-${direction}-${val}` : "";
  const array = intoArray(responsive);

  const responsiveClasses =
    array?.map((responsiveValue) => {
      const responsiveBaseClass = `gap-${direction}-${responsiveValue.value}`;
      return getResponsiveClass(responsiveValue.prefix, responsiveBaseClass);
    }) || [];

  return combineBaseAndResponsiveClasses(baseClass, responsiveClasses);
};

/**
 * Helper function to get a responsive class based on the MediaQueryPrefix and base css class passed in.
 * @param prefix - the responsive prefix we want to prepend to the base class
 * @param responsiveBaseClass - the base class for the resulting responsive class.
 * @returns a responsive css class, or an empty string if either argument is not defined
 */
export const getResponsiveClass = (
  prefix?: MediaQueryPrefix,
  responsiveBaseClass?: string,
) => {
  if (!prefix || !responsiveBaseClass) return "";

  const responsiveClass = `${prefix}:${responsiveBaseClass}`;

  return responsiveClass;
};

/**
 * Helper function to combine responsive and base classes into one resulting string
 * @param baseClass - the base class that is not responsive
 * @param responsiveBaseClass - the responsive classes as a list
 * @returns a css class that includes the passed base class and responsive classes, or an empty string if both arguments are not defined
 */
export const combineBaseAndResponsiveClasses = (
  baseClass?: string,
  responsiveClasses?: Array<string>,
): string => {
  return `${baseClass || ""} ${responsiveClasses?.join(" ") || ""}`.trim();
};

/**
 * Helper function to capitalize each word in a string of text.
 *
 * Examples:
 * 'name' -> 'Name'
 * 'my name' -> 'My Name'
 * @param text - the text we want to capitalize
 * @returns a string of text with each word capitalized
 */
export const capitalizeText = (text: string | null | undefined): string => {
  if (text == null || text === "") return "";

  const words = text.split(" ");

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * A helper function to get a singular or plural string based on the amount.
 *
 * Examples:
 * getSingularOrPlural('unit', 2) => 'units'
 * getSingularOrPlural('units', 1) => 'unit'
 *
 * @param text - the text we're going to return as singular or plural
 * @param amount - the amount we want to check against
 * @returns a singular or plural string
 */
export const getSingularOrPlural = (
  text: string,
  amount: number | string,
): string => {
  const parsedAmount = parseInt(amount.toString(), 10);

  if (Number.isNaN(parsedAmount) || parsedAmount < 0) return "";

  let result = text;

  const endsWithS = text.endsWith("s");

  if (parsedAmount === 1) {
    if (endsWithS) {
      result = text.slice(0, text.length - 1);
    }

    return result;
  } else {
    if (!endsWithS) {
      result += "s";
    }

    return result;
  }
};
