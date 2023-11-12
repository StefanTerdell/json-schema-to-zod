import { JSONSchema, JSONSchemaDefinition, Refs } from "../Types";
import { parseSchema } from "./parseSchema";

export const parseNot = (
  schema: JSONSchema & { not: JSONSchemaDefinition },
  refs: Refs
) => {
  return `z.any().refine((value) => !${parseSchema(schema.not, {
    ...refs,
    path: [...refs.path, "not"],
  })}.safeParse(value).success, "Invalid input: Should NOT be valid against schema")`;
};
