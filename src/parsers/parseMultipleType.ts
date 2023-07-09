import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { Refs } from '../Types';
import { parseSchema } from "./parseSchema";

export const parseMultipleType = (
  schema: JSONSchema7 & { type: JSONSchema7TypeName[] },
  refs: Refs
) => {
  return `z.union([${schema.type.map((type) =>
    parseSchema({ ...schema, type }, refs)
  )}])`;
};
