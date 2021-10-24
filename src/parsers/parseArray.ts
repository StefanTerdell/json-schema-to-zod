import { JSONSchema7 } from "json-schema";
import { parseSchema } from "./parseSchema";

export const parseArray = (schema: JSONSchema7 & { type: "array" }) => {
  let r = !schema.items
    ? "z.array(z.any())"
    : Array.isArray(schema.items)
    ? `z.tuple([${schema.items.map(parseSchema)}])`
    : `z.array(${parseSchema(schema.items)})`;
  if (schema.minItems !== undefined) r += `.min(${schema.minItems})`;
  if (schema.maxItems !== undefined) r += `.max(${schema.maxItems})`;
  return r;
};
