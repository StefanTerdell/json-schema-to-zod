import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { parseSchema, ParseSchemaContext } from "./parseSchema";

export const parseMultipleType = (
  schema: JSONSchema7 & { type: JSONSchema7TypeName[] },
  ctx: ParseSchemaContext
) => {
  return `z.union([${schema.type.map((type) =>
    parseSchema({ ...schema, type }, ctx)
  )}])`;
};
