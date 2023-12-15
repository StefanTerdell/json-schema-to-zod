import { JsonSchemaObject, Refs } from "../Types.js";
import { omit } from "../utils/omit.js";
import { parseSchema } from "./parseSchema.js";

/**
 * For compatibility with open api 3.0 nullable
 */
export const parseNullable = (
  schema: JsonSchemaObject & { nullable: true },
  refs: Refs,
) => {
  return `${parseSchema(omit(schema, "nullable"), refs, true)}.nullable()`;
};
