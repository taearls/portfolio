import { describe, expect, it } from "vitest";

import {
  AlignItemsCSSValue,
  FlexFlowCSSValue,
  GapCSSType,
  JustifyContentCSSValue,
  MediaQueryPrefix,
  MediaQueryPrefixValue,
  ResponsiveValue,
  TextAlignment,
} from "@/types/layout.ts";
import { ValueOf } from "@/types/util.ts";
import {
  capitalizeText,
  combineBaseAndResponsiveClasses,
  getAlignItemsClass,
  getFlexFlowClass,
  getGapClass,
  getJustifyContentClass,
  getResponsiveClass,
  getSingularOrPlural,
  getTextAlignmentClass,
  mergeClasses,
} from "@/util/styling/styling.utils.ts";
import styles from "./styling-test.module.css";

const createResponsiveClassTests = <T extends object>(
  testFn: (
    inputs: ValueOf<T>,
    responsive?:
      | Array<ResponsiveValue<ValueOf<T>>>
      | ResponsiveValue<ValueOf<T>>,
  ) => string,
  inputs: Array<[string, ValueOf<T>]>,
  expectedValues: Array<string>,
  obj: T,
  label: string,
) => {
  const responsivePrefixes: Array<MediaQueryPrefix> = [
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
  ];

  for (let i = 0; i < inputs.length; i++) {
    for (let j = 0; j < responsivePrefixes.length; j++) {
      const [name, input] = inputs[i];
      // TODO: clean this up into smaller methods.
      const responsiveValues: Array<ResponsiveValue<ValueOf<T>>> = [
        {
          prefix: responsivePrefixes[(j + 1) % responsivePrefixes.length],
          value: inputs[(i + 1) % inputs.length][1],
        },
        {
          prefix: responsivePrefixes[(j + 2) % responsivePrefixes.length],
          value: inputs[(i + 2) % inputs.length][1],
        },
      ];

      const expectedResponsiveClass = responsiveValues
        .map(
          (x) =>
            `${x.prefix}:${expectedValues[Object.values(obj).indexOf(x.value)]}`,
        )
        .join(" ")
        .trim();
      const expected = `${expectedValues[i]} ${expectedResponsiveClass}`;

      it(`will transform ${label}.${name} with responsive values: \n\t\t[\n\t\t\t${responsiveValues
        .map((x) => `{ prefix: ${x.prefix}, value: ${x.value} },\n\t\t\t`)
        .join("")
        .trim()}\n\t\t] into the correct class: ${expected}`, () => {
        const actual = testFn(input, responsiveValues);

        expect(actual).toEqual(expected);
      });
    }
  }
};

const createNonResponsiveClassTests = <T extends object>(
  testFn: (
    inputs: ValueOf<T>,
    responsive?: Array<ResponsiveValue<ValueOf<T>>>,
  ) => string,
  inputs: Array<[string, ValueOf<T>]>,
  expectedValues: Array<string>,
  label: string,
) => {
  for (let i = 0; i < inputs.length; i++) {
    const [name, input] = inputs[i];
    const expected = expectedValues[i];

    it(`will transform ${label}.${name} into the correct class: ${expected}`, () => {
      const actual = testFn(input);

      expect(actual).toEqual(expected);
    });
  }
};

describe("Styling util testing", () => {
  describe("mergeClasses", () => {
    it("will merge classes together", () => {
      const input = ["class1", "class2", "class3"];

      const actual = mergeClasses(...input);

      const expected = "class1 class2 class3";

      expect(actual).toEqual(expected);
    });

    it("will merge classes together from a CSS module", () => {
      const input = [
        styles["test-class1"],
        styles["test-class2"],
        styles["test-class3"],
      ];

      const actual = mergeClasses(...input);

      const expected = "test-class1 test-class2 test-class3";

      // we don't know what the class name hash would be.
      // if the expected name is in the actual string, that's fine.
      expected
        .split(" ")
        .forEach((className) => expect(actual).toMatch(className));
    });

    it("will merge classes together and filter out classes which dont match a condition", () => {
      // eslint-disable-next-line no-constant-binary-expression
      const input = ["class1", false && "class2", "class3"];

      const actual = mergeClasses(...input);

      const expected = "class1 class3";

      expect(actual).toEqual(expected);
    });

    it("will merge classes together and filter out classes which are empty strings", () => {
      const input = ["class1", "", "", "", "class2", "class3"];

      const actual = mergeClasses(...input);

      const expected = "class1 class2 class3";

      expect(actual).toEqual(expected);
    });

    it("will merge classes together and not filter out classes which match a condition", () => {
      // eslint-disable-next-line no-constant-binary-expression
      const input = ["class1", true && "class2", "class3"];

      const actual = mergeClasses(...input);

      const expected = "class1 class2 class3";

      expect(actual).toEqual(expected);
    });

    it("will return an empty string if an empty list of classes is passed", () => {
      const input = "";

      const actual = mergeClasses(input);

      const expected = "";

      expect(actual).toEqual(expected);
    });
  });

  describe("capitalizeText", () => {
    it("will capitalize multiple words", () => {
      const input = "lowercased title";

      const actual = capitalizeText(input);

      const expected = "Lowercased Title";

      expect(actual).toEqual(expected);
    });

    it("will capitalize a single letter", () => {
      const input = "l";

      const actual = capitalizeText(input);

      const expected = "L";

      expect(actual).toEqual(expected);
    });

    it("will return an empty string if one is passed", () => {
      const input = "";

      const actual = capitalizeText(input);

      const expected = "";

      expect(actual).toEqual(expected);
    });
  });

  describe("getSingularOrPlural", () => {
    it("will return a singular unit if amount is 1", () => {
      const unit = "unit";

      const units = "units";

      const amount = 1;

      const actualUnit = getSingularOrPlural(unit, amount);

      const actualUnits = getSingularOrPlural(units, amount);

      const expected = unit;

      expect(actualUnit).toEqual(expected);

      expect(actualUnits).toEqual(expected);
    });

    it("will return a plural unit if amount is 0", () => {
      const unit = "unit";

      const units = "units";

      const amount = 0;

      const actualUnit = getSingularOrPlural(unit, amount);

      const actualUnits = getSingularOrPlural(units, amount);

      const expected = units;

      expect(actualUnit).toEqual(expected);

      expect(actualUnits).toEqual(expected);
    });

    it("will return a plural unit if amount is > 1", () => {
      const unit = "unit";

      const units = "units";

      const amount = 2;

      const actualUnit = getSingularOrPlural(unit, amount);

      const actualUnits = getSingularOrPlural(units, amount);

      const expected = units;

      expect(actualUnit).toEqual(expected);

      expect(actualUnits).toEqual(expected);
    });

    it("will return an empty string if amount is < 0", () => {
      const unit = "unit";

      const units = "units";

      const amount = -1;

      const actualUnit = getSingularOrPlural(unit, amount);

      const actualUnits = getSingularOrPlural(units, amount);

      const expected = "";

      expect(actualUnit).toEqual(expected);

      expect(actualUnits).toEqual(expected);
    });

    it("will parse amounts as strings", () => {
      const unit = "unit";

      const units = "units";

      const amount = "4";

      const actualUnit = getSingularOrPlural(unit, amount);

      const actualUnits = getSingularOrPlural(units, amount);

      const expected = units;

      expect(actualUnit).toEqual(expected);

      expect(actualUnits).toEqual(expected);
    });

    it("will parse return an empty string if amount string is NaN", () => {
      const unit = "unit";

      const units = "units";

      const amount = "not a number";

      const actualUnit = getSingularOrPlural(unit, amount);

      const actualUnits = getSingularOrPlural(units, amount);

      const expected = "";

      expect(actualUnit).toEqual(expected);

      expect(actualUnits).toEqual(expected);
    });
  });

  describe("getJustifyContentClass", () => {
    const inputs = Object.entries(JustifyContentCSSValue);
    const expectedValues = [
      "justify-center",
      "justify-end",
      "justify-normal",
      "justify-around",
      "justify-between",
      "justify-evenly",
      "justify-start",
      "justify-stretch",
    ];

    describe("non-responsive classes", () => {
      createNonResponsiveClassTests<typeof JustifyContentCSSValue>(
        getJustifyContentClass,
        inputs,
        expectedValues,
        "JustifyContentCSSType",
      );
    });

    describe("responsive classes", () => {
      it("single responsive class with base class", () => {
        const responsive = {
          prefix: MediaQueryPrefixValue.SM,
          value: JustifyContentCSSValue.END,
        };

        const actual = getJustifyContentClass(
          JustifyContentCSSValue.CENTER,
          responsive,
        );

        const expected = "justify-center sm:justify-end";

        expect(actual).toEqual(expected);
      });
      it("single responsive class with no base class", () => {
        const responsive = {
          prefix: MediaQueryPrefixValue.SM,
          value: JustifyContentCSSValue.END,
        };

        const actual = getJustifyContentClass(undefined, responsive);

        const expected = "sm:justify-end";

        expect(actual).toEqual(expected);
      });

      createResponsiveClassTests(
        getJustifyContentClass,
        inputs,
        expectedValues,
        JustifyContentCSSValue,
        "JustifyContentCSSType",
      );
    });
  });

  describe("getAlignItemsClass", () => {
    const inputs = Object.entries(AlignItemsCSSValue);
    const expectedValues = [
      "items-baseline",
      "items-center",
      "items-end",
      "items-start",
      "items-stretch",
    ];

    describe("non-responsive classes", () => {
      createNonResponsiveClassTests<typeof AlignItemsCSSValue>(
        getAlignItemsClass,
        inputs,
        expectedValues,
        "AlignItemsCSSType",
      );
    });

    describe("responsive classes", () => {
      it("single responsive class with base class", () => {
        const responsive = {
          prefix: MediaQueryPrefixValue.SM,
          value: AlignItemsCSSValue.END,
        };

        const actual = getAlignItemsClass(
          AlignItemsCSSValue.CENTER,
          responsive,
        );

        const expected = "items-center sm:items-end";

        expect(actual).toEqual(expected);
      });

      it("single responsive class with no base class", () => {
        const responsive = {
          prefix: MediaQueryPrefixValue.SM,
          value: AlignItemsCSSValue.END,
        };

        const actual = getAlignItemsClass(undefined, responsive);

        const expected = "sm:items-end";

        expect(actual).toEqual(expected);
      });

      // table test for multiple responsive tests.
      createResponsiveClassTests(
        getAlignItemsClass,
        inputs,
        expectedValues,
        AlignItemsCSSValue,
        "AlignItemsCSSType",
      );
    });
  });

  describe("getGapClass", () => {
    describe("non-responsive classes", () => {
      it("creates a horizontal class", () => {
        const input: GapCSSType = {
          direction: "x",
          value: 1,
        };

        const actual = getGapClass(input.direction, input.value, undefined);

        const expected = "gap-x-1";

        expect(actual).toEqual(expected);
      });
      it("creates a vertical class", () => {
        const input: GapCSSType = {
          direction: "y",
          value: 1,
        };

        const actual = getGapClass(input.direction, input.value, undefined);

        const expected = "gap-y-1";

        expect(actual).toEqual(expected);
      });
    });

    describe("responsive classes", () => {
      it("creates a horizontal class", () => {
        const input: GapCSSType = {
          direction: "x",
          value: 1,
        };

        const responsive: ResponsiveValue<GapCSSType["value"]> = {
          prefix: "sm",
          value: 2,
        };

        const actual = getGapClass(input.direction, input.value, responsive);

        const expected = "gap-x-1 sm:gap-x-2";

        expect(actual).toEqual(expected);
      });

      it("creates a horizontal class with no base class", () => {
        const responsive: ResponsiveValue<GapCSSType["value"]> = {
          prefix: "sm",
          value: 2,
        };

        const actual = getGapClass("x", undefined, responsive);

        const expected = "sm:gap-x-2";

        expect(actual).toEqual(expected);
      });

      it("creates a vertical class", () => {
        const input: GapCSSType = {
          direction: "y",
          value: 1,
        };

        const responsive: ResponsiveValue<GapCSSType["value"]> = {
          prefix: "sm",
          value: 2,
        };

        const actual = getGapClass(input.direction, input.value, responsive);

        const expected = "gap-y-1 sm:gap-y-2";

        expect(actual).toEqual(expected);
      });

      it("creates a vertical class with no base class", () => {
        const responsive: ResponsiveValue<GapCSSType["value"]> = {
          prefix: "sm",
          value: 2,
        };

        const actual = getGapClass("y", undefined, responsive);

        const expected = "sm:gap-y-2";

        expect(actual).toEqual(expected);
      });
    });
  });

  describe("getFlexFlowClass", () => {
    const inputs = Object.entries(FlexFlowCSSValue);
    const expectedValues = ["flex-col", "flex-row"];

    describe("non-responsive classes", () => {
      createNonResponsiveClassTests<typeof FlexFlowCSSValue>(
        getFlexFlowClass,
        inputs,
        expectedValues,
        "FlexFlowCSSType",
      );
    });

    describe("responsive classes", () => {
      it("single responsive class with base class", () => {
        const responsive = {
          prefix: MediaQueryPrefixValue.SM,
          value: FlexFlowCSSValue.COLUMN,
        };

        const actual = getFlexFlowClass(FlexFlowCSSValue.ROW, responsive);

        const expected = "flex-row sm:flex-col";

        expect(actual).toEqual(expected);
      });
      it("single responsive class with no base class", () => {
        const responsive = {
          prefix: MediaQueryPrefixValue.SM,
          value: FlexFlowCSSValue.COLUMN,
        };

        const actual = getFlexFlowClass(undefined, responsive);

        const expected = "sm:flex-col";

        expect(actual).toEqual(expected);
      });

      createResponsiveClassTests(
        getFlexFlowClass,
        inputs,
        expectedValues,
        FlexFlowCSSValue,
        "JustifyContentCSSType",
      );
    });
  });

  describe("getTextAlignmentClass", () => {
    it("gets a left-aligned class", () => {
      const input = TextAlignment.LEFT;

      const actual = getTextAlignmentClass(input);

      const expected = "text-left";

      expect(actual).toEqual(expected);
    });
    it("gets a center-aligned class", () => {
      const input = TextAlignment.CENTER;

      const actual = getTextAlignmentClass(input);

      const expected = "text-center";

      expect(actual).toEqual(expected);
    });
    it("gets a right-aligned class", () => {
      const input = TextAlignment.RIGHT;

      const actual = getTextAlignmentClass(input);

      const expected = "text-right";

      expect(actual).toEqual(expected);
    });
  });

  describe("getResponsiveClass", () => {
    it("gets a responsive class", () => {
      const prefix = MediaQueryPrefixValue.LG;
      const baseClass = "text-right";

      const actual = getResponsiveClass(prefix, baseClass);

      const expected = "lg:text-right";

      expect(actual).toEqual(expected);
    });
    it("returns an empty string if either arg is undefined", () => {
      let actual = getResponsiveClass(undefined, "foo");

      const expected = "";

      expect(actual).toEqual(expected);

      actual = getResponsiveClass(MediaQueryPrefixValue.LG, undefined);

      expect(actual).toEqual(expected);

      actual = getResponsiveClass(undefined, undefined);

      expect(actual).toEqual(expected);
    });
  });

  describe("combineBaseAndResponsiveClasses", () => {
    it("combines a base class with responsive classes", () => {
      const baseClass = "text-right";
      const responsiveClasses = ["sm:text-left", "md:text-center"];

      const actual = combineBaseAndResponsiveClasses(
        baseClass,
        responsiveClasses,
      );

      const expected = "text-right sm:text-left md:text-center";

      expect(actual).toEqual(expected);
    });

    it("returns only a baseClass if responsive classes are not defined", () => {
      const baseClass = "text-right";
      const responsiveClasses = undefined;

      const actual = combineBaseAndResponsiveClasses(
        baseClass,
        responsiveClasses,
      );

      const expected = "text-right";

      expect(actual).toEqual(expected);
    });

    it("returns only responsive classes if the baseClass is not defined", () => {
      const baseClass = undefined;
      const responsiveClasses = ["sm:text-left", "md:text-center"];

      const actual = combineBaseAndResponsiveClasses(
        baseClass,
        responsiveClasses,
      );

      const expected = "sm:text-left md:text-center";

      expect(actual).toEqual(expected);
    });

    it("returns an empty string if both args are not defined", () => {
      const baseClass = undefined;
      const responsiveClasses = undefined;

      const actual = combineBaseAndResponsiveClasses(
        baseClass,
        responsiveClasses,
      );

      const expected = "";

      expect(actual).toEqual(expected);
    });
  });
});
