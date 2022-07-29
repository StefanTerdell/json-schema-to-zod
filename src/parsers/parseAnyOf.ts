import {
  JSONSchema7,
  JSONSchema7Definition
} from "json-schema";
import { parseSchema, ParseSchemaContext } from "./parseSchema";

export const parseAnyOf = (
  schema: JSONSchema7 & { anyOf: JSONSchema7Definition[]; },
  ctx: ParseSchemaContext
) => {
  return `z.union([${schema.anyOf.map(item => parseSchema(item, ctx))}])`;
};
