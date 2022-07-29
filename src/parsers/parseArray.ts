import { JSONSchema7 } from "json-schema";
import { parseSchema, ParseSchemaContext } from "./parseSchema";

export const parseArray = (schema: JSONSchema7 & { type: "array" }, ctx: ParseSchemaContext) => {
  let r = !schema.items
    ? "z.array(z.any())"
    : Array.isArray(schema.items)
    ? `z.tuple([${schema.items.map((item) => parseSchema(item, ctx))}])`
    : `z.array(${parseSchema(schema.items, ctx)})`;
  if (typeof schema.minItems === "number") r += `.min(${schema.minItems})`;
  if (typeof schema.maxItems === "number") r += `.max(${schema.maxItems})`;
  return r;
};
