import { half } from "../utils/half";
import { parseSchema } from "../parseSchema";

export const parseAllOf = (allOf: any[]): string => {
  if (allOf.length === 0) {
    return "z.any()";
  } else if (allOf.length === 1) {
    return parseSchema(allOf[0]);
  } else {
    const [left, right] = half(allOf);
    return `z.intersection(${parseAllOf(left)},${parseAllOf(right)})`;
  }
};
