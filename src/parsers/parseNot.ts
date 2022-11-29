import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { parseSchema } from "./parseSchema";

export const parseNot = (
  schema: JSONSchema7 & { not: JSONSchema7Definition },
  withoutDefaults?: boolean
) => {
  return `z.any().refine((value) => !${parseSchema(
    schema.not,
    withoutDefaults
  )}.safeParse(value).success, "Invalid input: Should NOT be valid against schema")`;
};
