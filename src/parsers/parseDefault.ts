import { JSONSchema7 } from "json-schema";

export const parseDefault = (schema: JSONSchema7) => {
  return "z.any()";
};
