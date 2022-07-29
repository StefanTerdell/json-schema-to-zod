import { JSONSchema7, JSONSchema7Type } from "json-schema";

export const parseEnum = (
  schema: JSONSchema7 & { enum: JSONSchema7Type[] | JSONSchema7Type }
) => {
  return Array.isArray(schema.enum)
    ? schema.enum.every((x) => typeof x === "string")
      ? `z.enum([${schema.enum.map((x) => JSON.stringify(x))}])`
      : `z.union([${schema.enum.map((x) => `z.literal(${JSON.stringify(x)})`)}])`
    : `z.literal(${JSON.stringify(schema.enum)})`;
};
