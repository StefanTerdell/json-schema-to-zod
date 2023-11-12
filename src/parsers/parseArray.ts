import { JSONSchema, Refs } from "../Types";
import { withMessage } from "../utils/withMessage";
import { parseSchema } from "./parseSchema";

export const parseArray = (
  schema: JSONSchema & { type: "array" },
  refs: Refs,
) => {
  if (Array.isArray(schema.items)) {
    return `z.tuple([${schema.items.map((v, i) =>
      parseSchema(v, { ...refs, path: [...refs.path, "items", i] }),
    )}])`;
  }

  let r = !schema.items
    ? "z.array(z.any())"
    : `z.array(${parseSchema(schema.items, {
        ...refs,
        path: [...refs.path, "items"],
      })})`;

  r += withMessage(schema, "minItems", ({ json }) => [
    `.min(${json}`,
    ", ",
    ")",
  ]);

  r += withMessage(schema, "maxItems", ({ json }) => [
    `.max(${json}`,
    ", ",
    ")",
  ]);

  return r;
};
