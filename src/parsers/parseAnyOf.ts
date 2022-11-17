import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { parseSchema } from "./parseSchema";

export const parseAnyOf = (
  schema: JSONSchema7 & { anyOf: JSONSchema7Definition[] }
) => {
  return schema.anyOf.length
    ? schema.anyOf.length === 1
      ? parseSchema(schema.anyOf[0])
      : `z.union([${schema.anyOf.map(parseSchema)}])`
    : `z.any()`;
};
