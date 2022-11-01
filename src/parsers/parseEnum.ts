import { JSONSchema7, JSONSchema7Type } from "json-schema";

export const parseEnum = (
  schema: JSONSchema7 & { enum: JSONSchema7Type[] | JSONSchema7Type }
) => {
  if (Array.isArray(schema.enum)) {
    if (schema.enum.every((x) => typeof x === 'string')) {
      return `z.enum([${schema.enum.map((x) => JSON.stringify(x))}])`;
    } else if (schema.enum.length === 1) {  // union does not work when there is only one element
      return `z.literal(${JSON.stringify(schema.enum[0])})`;
    } else {
      return `z.union([${schema.enum.map((x) => `z.literal(${JSON.stringify(x)})`)}])`;
    }
  } else {
    return `z.literal(${JSON.stringify(schema.enum)})`;
  }
};
