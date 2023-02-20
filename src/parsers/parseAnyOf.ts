import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { Parser, parseSchema } from "./parseSchema";

export const parseAnyOf = (
  schema: JSONSchema7 & { anyOf: JSONSchema7Definition[] },
  withoutDefaults?: boolean,
  customParsers: Record<string, Parser> = {}
) => {
  return schema.anyOf.length
    ? schema.anyOf.length === 1
      ? parseSchema(schema.anyOf[0], withoutDefaults, customParsers)
      : `z.union([${schema.anyOf.map((schema) =>
          parseSchema(schema, withoutDefaults, customParsers)
        )}])`
    : `z.any()`;
};
