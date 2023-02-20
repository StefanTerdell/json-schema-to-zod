import { JSONSchema7 } from "json-schema";
import { omit } from "../utils/omit";
import { parseSchema, Parser } from "./parseSchema";

/**
 * For compatibility with open api 3.0 nullable
 */
export const parseNullable = (
  schema: JSONSchema7 & { nullable: true },
  includeDefaults?: boolean,
  customParsers: Record<string, Parser> = {}
) => {
  return `${parseSchema(omit(schema, "nullable"), includeDefaults, customParsers)}.nullable()`;
};
