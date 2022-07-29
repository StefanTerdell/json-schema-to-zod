import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { parseSchema, ParseSchemaContext } from "./parseSchema";
import { half } from "../utils/half";

export function parseAllOf(
  schema: JSONSchema7 & { allOf: JSONSchema7Definition[] },
  ctx: ParseSchemaContext
): string {
  if (schema.allOf.length === 0) {
    return "z.any()";
  } else if (schema.allOf.length === 1) {
    return parseSchema(schema.allOf[0], ctx);
  } else {
    const [left, right] = half(schema.allOf);
    return `z.intersection(${parseAllOf({ allOf: left }, ctx)},${parseAllOf({
      allOf: right,
    }, ctx)})`;
  }
}
