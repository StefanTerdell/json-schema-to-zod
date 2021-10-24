import { JSONSchema7, JSONSchema7Type } from "json-schema";

export const parseEnum = (
  schema: JSONSchema7 & { enum: JSONSchema7Type[] | JSONSchema7Type }
) => {
  return Array.isArray(schema.enum)
    ? `z.enum([${schema.enum.map((x: any) => JSON.stringify(x))}])`
    : `z.literal(${JSON.stringify(schema.enum)})`;
};
