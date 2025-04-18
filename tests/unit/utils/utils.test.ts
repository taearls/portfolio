import { intoArray } from "@/util/utils.ts";

describe("utils tests", () => {
  describe("intoArray", () => {
    it("will return the original array if one is passed", () => {
      const input = ["foo"];

      const actual = intoArray(input);

      const expected = input;

      expect(actual).toEqual(expected);
    });
    it("will wrap a single item in an array if only a single item is passed", () => {
      const input = "foo";

      const actual = intoArray(input);

      const expected = ["foo"];

      expect(actual).toEqual(expected);
    });
    it("will return an empty array if an undefined argument is passed", () => {
      const input = undefined;

      const actual = intoArray(input);

      const expected: typeof actual = [];

      expect(actual).toEqual(expected);
    });
  });
});
