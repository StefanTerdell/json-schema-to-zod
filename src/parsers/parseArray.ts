import { JSONSchema7 } from "json-schema";
import { parseSchema } from "./parseSchema";

export const parseArray = (schema: JSONSchema7 & { type: "array" },includeDefaults: boolean) => {
  let r = !schema.items
    ? "z.array(z.any())"
    : Array.isArray(schema.items)
    ? `z.tuple([${schema.items.map(v => parseSchema(v, includeDefaults))}])`
    : `z.array(${parseSchema(schema.items, includeDefaults)})`;
  if (typeof schema.minItems === "number") r += `.min(${schema.minItems})`;
  if (typeof schema.maxItems === "number") r += `.max(${schema.maxItems})`;
  return r;
};
