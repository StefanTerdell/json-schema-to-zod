import { JSONSchema7 } from "json-schema";
import { parseSchema } from "./parseSchema";

const requiredFlag = ""; //".required()"
const defaultAdditionalFlag = ""; //".strip()"

export const parseObject = (schema: JSONSchema7 & { type: "object" }) => {
  return !schema.properties
    ? typeof schema.additionalProperties === "object"
      ? `z.record(${parseSchema(schema.additionalProperties)})`
      : schema.additionalProperties === false
      ? "z.object({}).strict()"
      : "z.record(z.any())"
    : `z.object({${Object.entries(schema?.properties ?? {}).map(
        ([k, v]) =>
          `${JSON.stringify(k)}:${parseSchema(v)}${
            schema.required?.includes(k) ? requiredFlag : ".optional()"
          }`
      )}})${
        schema.additionalProperties === true
          ? ".catchall(z.any())"
          : schema.additionalProperties === false
          ? ".strict()"
          : typeof schema.additionalProperties === "object"
          ? `.catchall(${parseSchema(schema.additionalProperties)})`
          : defaultAdditionalFlag
      }`;
};
