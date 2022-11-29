import { JSONSchema7 } from "json-schema";

export const parseBoolean = (schema: JSONSchema7 & { type: "boolean" }) => {
  return "z.boolean()";
};
