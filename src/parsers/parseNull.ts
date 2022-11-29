import { JSONSchema7 } from "json-schema";

export const parseNull = (schema: JSONSchema7 & { type: "null" }) => {
  return "z.null()";
};
