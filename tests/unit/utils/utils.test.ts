import {
  cloneDeep,
  getCloudinarySrc,
  getCurrentYear,
  getLinkWithAnalytics,
  getRandomNumberInRange,
  getTextAlignmentClass,
  intoArray,
} from "@/util/utils.ts";

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

  describe("getTextAlignmentClass", () => {
    it("will return text-left for left alignment", () => {
      const actual = getTextAlignmentClass("left");
      expect(actual).toBe("text-left");
    });

    it("will return text-center for center alignment", () => {
      const actual = getTextAlignmentClass("center");
      expect(actual).toBe("text-center");
    });

    it("will return text-right for right alignment", () => {
      const actual = getTextAlignmentClass("right");
      expect(actual).toBe("text-right");
    });

    it("will return text-center for unknown alignment", () => {
      const actual = getTextAlignmentClass(
        "unknown" as "left" | "center" | "right",
      );
      expect(actual).toBe("text-center");
    });
  });

  describe("getCloudinarySrc", () => {
    it("will return base URL without transformations when empty array", () => {
      const actual = getCloudinarySrc("test-image", "jpg", []);
      expect(actual).toBe(
        "https://res.cloudinary.com/taearls/image/upload/test-image.jpg",
      );
    });

    it("will return URL with transformations when provided", () => {
      const actual = getCloudinarySrc("test-image", "png", ["c_crop", "w_300"]);
      expect(actual).toBe(
        "https://res.cloudinary.com/taearls/image/upload/c_crop,w_300/v1/test-image.png",
      );
    });

    it("will handle multiple transformations correctly", () => {
      const actual = getCloudinarySrc("profile", "jpg", [
        "ar_3:4",
        "c_crop",
        "g_face",
        "w_900",
      ]);
      expect(actual).toBe(
        "https://res.cloudinary.com/taearls/image/upload/ar_3:4,c_crop,g_face,w_900/v1/profile.jpg",
      );
    });
  });

  describe("getLinkWithAnalytics", () => {
    it("will return original URL when no analytics provided", () => {
      const actual = getLinkWithAnalytics("https://example.com");
      expect(actual).toBe("https://example.com");
    });

    it("will append analytics parameters when provided", () => {
      const analytics = {
        campaign: "portfolio",
        medium: "web",
        source: "github",
      };
      const actual = getLinkWithAnalytics("https://example.com", analytics);
      expect(actual).toBe(
        "https://example.com?utm_campaign=portfolio&utm_medium=web&source=github",
      );
    });

    it("will handle undefined analytics gracefully", () => {
      const actual = getLinkWithAnalytics("https://example.com", undefined);
      expect(actual).toBe("https://example.com");
    });
  });

  describe("getCurrentYear", () => {
    it("will return current year", () => {
      const actual = getCurrentYear();
      const expected = new Date().getFullYear();
      expect(actual).toBe(expected);
    });
  });

  describe("getRandomNumberInRange", () => {
    it("will return number within specified range", () => {
      const result = getRandomNumberInRange({ min: 1, max: 10 });
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });

    it("will use default min value of 1", () => {
      const result = getRandomNumberInRange({ max: 5 });
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(5);
    });

    it("will handle edge case where min equals max", () => {
      const result = getRandomNumberInRange({ min: 5, max: 5 });
      expect(result).toBe(5);
    });
  });

  describe("cloneDeep", () => {
    it("will create deep copy of object", () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = cloneDeep(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it("will handle nested arrays", () => {
      const original = { items: [1, 2, { nested: 3 }] };
      const cloned = cloneDeep(original);

      expect(cloned).toEqual(original);
      expect(cloned.items).not.toBe(original.items);
      expect(cloned.items[2]).not.toBe(original.items[2]);
    });
  });
});
