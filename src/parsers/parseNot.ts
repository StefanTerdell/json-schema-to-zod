import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { Parser, parseSchema } from "./parseSchema";

export const parseNot = (
  schema: JSONSchema7 & { not: JSONSchema7Definition },
  withoutDefaults?: boolean,
  customParsers: Record<string, Parser> = {}
) => {
  return `z.any().refine((value) => !${parseSchema(
    schema.not,
    withoutDefaults,
    customParsers
  )}.safeParse(value).success, "Invalid input: Should NOT be valid against schema")`;
};
