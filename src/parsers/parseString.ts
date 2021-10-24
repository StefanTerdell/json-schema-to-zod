import { JSONSchema7 } from "json-schema";

export const parseString = (schema: JSONSchema7 & { type: "string" }) => {
  let r = "z.string()";
  if (schema.pattern) r += `.regex(new RegExp("${schema.pattern}"))`;
  if (schema.format === "email") r += ".email()";
  else if (schema.format === "uri") r += ".url()";
  else if (schema.format === "uuid") r += ".uuid()";
  if (schema.minLength !== undefined) r += `.min(${schema.minLength})`;
  if (schema.maxLength !== undefined) r += `.max(${schema.maxLength})`;
  return r;
};
