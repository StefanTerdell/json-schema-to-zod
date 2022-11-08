import {
  JSONSchema7,
  JSONSchema7Definition
} from "json-schema";
import { parseSchema } from "./parseSchema";

export const parseAnyOf = (
  schema: JSONSchema7 & { anyOf: JSONSchema7Definition[]; },includeDefaults: boolean
) => {
  return `z.union([${schema.anyOf.map(v => parseSchema(v, includeDefaults))}])`;
};
