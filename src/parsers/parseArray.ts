import { JSONSchema7 } from "json-schema";
import { Parser, parseSchema } from "./parseSchema";

export const parseArray = (
  schema: JSONSchema7 & { type: "array" },
  withoutDefaults?: boolean,
  customParsers: Record<string, Parser> = {}
) => {
  let r = !schema.items
    ? "z.array(z.any())"
    : Array.isArray(schema.items)
    ? `z.tuple([${schema.items.map((v) => parseSchema(v, withoutDefaults, customParsers))}])`
    : `z.array(${parseSchema(schema.items, withoutDefaults, customParsers)})`;
  if (typeof schema.minItems === "number") r += `.min(${schema.minItems})`;
  if (typeof schema.maxItems === "number") r += `.max(${schema.maxItems})`;
  return r;
};
