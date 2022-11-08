import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { parseSchema } from "./parseSchema";

export const parseMultipleType = (
  schema: JSONSchema7 & { type: JSONSchema7TypeName[] },includeDefaults: boolean
) => {
  return `z.union([${schema.type.map((type) =>
    parseSchema({ ...schema, type }, includeDefaults)
  )}])`;
};
