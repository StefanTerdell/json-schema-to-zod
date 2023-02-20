import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { Parser, parseSchema } from "./parseSchema";

export const parseMultipleType = (
  schema: JSONSchema7 & { type: JSONSchema7TypeName[] },
  withoutDefaults?: boolean,
  customParsers: Record<string, Parser> = {}
) => {
  return `z.union([${schema.type.map((type) =>
    parseSchema({ ...schema, type }, withoutDefaults, customParsers)
  )}])`;
};
