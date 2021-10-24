import { JSONSchema7, JSONSchema7Type } from "json-schema";

export const parseConst = (
  schema: JSONSchema7 & { const: JSONSchema7Type }
) => {
  return `z.literal(${JSON.stringify(schema.const)})`;
};
