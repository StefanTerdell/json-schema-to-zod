import { JSONSchema7 } from "json-schema";
import { omit } from "../utils/omit";
import { parseSchema } from "./parseSchema";

/**
 * For compatibility with open api 3.0 nullable
 */
export const parseNullable = (schema: JSONSchema7 & { nullable: true }, includeDefaults: boolean) => {
  return `${parseSchema(omit(schema, "nullable"), includeDefaults)}.nullable()`;
};
