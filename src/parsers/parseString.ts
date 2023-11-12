import { JSONSchema7 } from "json-schema";

export const parseString = (schema: JSONSchema7 & { type: "string" }) => {
  let r = "z.string()";
  if (schema.pattern)
    r += `.regex(new RegExp(${JSON.stringify(schema.pattern)}))`;
  if (schema.format === "email") r += ".email()";
  if (schema.format === "ip") r += ".ip()";
  if (schema.format === "ipv4") r += ".ip({ version: 'v4' })";
  if (schema.format === "ipv6") r += ".ip({ version: 'v6' })" ;
  if (schema.format === "uri") r += ".url()";
  if (schema.format === "uuid") r += ".uuid()";
  if (schema.format === "date-time") r += ".datetime()";
  if (typeof schema.minLength === "number") r += `.min(${schema.minLength})`;
  if (typeof schema.maxLength === "number") r += `.max(${schema.maxLength})`;
  return r;
};
