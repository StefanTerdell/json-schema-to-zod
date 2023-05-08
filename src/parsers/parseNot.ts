import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { Refs } from "../Types";
import { parseSchema } from "./parseSchema";

export const parseNot = (
  schema: JSONSchema7 & { not: JSONSchema7Definition },
  refs: Refs
) => {
  return `z.any().refine((value) => !${parseSchema(schema.not, {
    ...refs,
    path: [...refs.path, "not"],
  })}.safeParse(value).success, "Invalid input: Should NOT be valid against schema")`;
};
