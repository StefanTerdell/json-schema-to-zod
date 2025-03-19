import { JsonSchemaObject, Refs } from "../Types.js";
import { parseSchema } from "./parseSchema.js";

export const parseMultipleType = (
  schema: JsonSchemaObject & { type: string[] },
  refs: Refs,
) => {
  return `z.union([${schema.type
    .map((type) => parseSchema({ ...schema, type } as any, {...refs, withoutDefaults: true}))
    .join(", ")}])`;
};
