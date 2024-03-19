import { TextAlignment } from ".";

export const getAlignmentClass = (alignment: TextAlignment): string => {
  switch (alignment) {
    case "left": {
      return "text-left";
    }
    case "center": {
      return "text-center";
    }
    case "right":
      return "text-right";
  }
};
