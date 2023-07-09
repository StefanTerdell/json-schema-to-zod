import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { Refs } from "../Types";
import { parseSchema } from "./parseSchema";

export const parseAnyOf = (
  schema: JSONSchema7 & { anyOf: JSONSchema7Definition[] },
  refs: Refs
) => {
  return schema.anyOf.length
    ? schema.anyOf.length === 1
      ? parseSchema(schema.anyOf[0], {
          ...refs,
          path: [...refs.path, "anyOf", 0],
        })
      : `z.union([${schema.anyOf.map((schema, i) =>
          parseSchema(schema, { ...refs, path: [...refs.path, "anyOf", i] })
        )}])`
    : `z.any()`;
};
