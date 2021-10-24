import {
  JSONSchema7,
  JSONSchema7Definition
} from "json-schema";

export const parseNot = (schema: JSONSchema7 & { not: JSONSchema7Definition; }) => {
  return "z.undefined()";
};
