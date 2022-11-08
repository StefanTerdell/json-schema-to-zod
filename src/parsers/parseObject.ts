import { JSONSchema7 } from "json-schema";
import { parseSchema } from "./parseSchema";

const requiredFlag = ""; //".required()"
const defaultAdditionalFlag = ""; //".strip()"

export const parseObject = (schema: JSONSchema7 & { type: "object" },includeDefaults: boolean) => {
  return !schema.properties
    ? typeof schema.additionalProperties === "object"
      ? `z.record(${parseSchema(schema.additionalProperties, includeDefaults)})`
      : "z.object({}).catchall(z.any())"
    : `z.object({${Object.entries(schema?.properties ?? {}).map(
        ([k, v]) =>
          `${JSON.stringify(k)}:${parseSchema(v, includeDefaults)}${
            schema.required?.includes(k) || (includeDefaults && v.hasOwnProperty('default')) ? requiredFlag : ".optional()"
          }`
      )}})${
        schema.additionalProperties === true
          ? ".catchall(z.any())"
          : schema.additionalProperties === false
          ? ".strict()"
          : typeof schema.additionalProperties === "object"
          ? `.catchall(${parseSchema(schema.additionalProperties, includeDefaults)})`
          : defaultAdditionalFlag
      }`;
};
