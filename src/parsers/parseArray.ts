import { JSONSchema, Refs } from "../Types";
import { parseSchema } from "./parseSchema";

export const parseArray = (
  schema: JSONSchema & { type: "array" },
  refs: Refs
) => {
  let r = !schema.items
    ? "z.array(z.any())"
    : Array.isArray(schema.items)
    ? `z.tuple([${schema.items.map((v, i) =>
        parseSchema(v, { ...refs, path: [...refs.path, "items", i] })
      )}])`
    : `z.array(${parseSchema(schema.items, {
        ...refs,
        path: [...refs.path, "items"],
      })})`;
  if (typeof schema.minItems === "number") r += `.min(${schema.minItems})`;
  if (typeof schema.maxItems === "number") r += `.max(${schema.maxItems})`;
  return r;
};
