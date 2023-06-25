import { JSONSchema7 } from "json-schema";

export const parseString = (schema: JSONSchema7 & { type: "string" }) => {
  let r = "z.string()";
  if (schema.pattern)
    r += `.regex(new RegExp(${JSON.stringify(schema.pattern)}))`;
  if (schema.format === "email") r += ".email()";
  else if (schema.format === "uri") r += ".url()";
  else if (schema.format === "uuid") r += ".uuid()";
  else if (schema.format === "date-time") r += ".datetime()";
  if (typeof schema.minLength === "number") r += `.min(${schema.minLength})`;
  if (typeof schema.maxLength === "number") r += `.max(${schema.maxLength})`;
  return r;
};
