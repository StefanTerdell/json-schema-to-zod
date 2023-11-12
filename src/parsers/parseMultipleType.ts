import { JSONSchema, JSONSchemaTypeName, Refs } from '../Types';
import { parseSchema } from "./parseSchema";

export const parseMultipleType = (
  schema: JSONSchema & { type: JSONSchemaTypeName[] },
  refs: Refs
) => {
  return `z.union([${schema.type.map((type) =>
    parseSchema({ ...schema, type } as any, refs)
  )}])`;
};
