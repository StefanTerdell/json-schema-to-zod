import { JSONSchema7 } from "json-schema";
import { parseSchema, ParseSchemaContext } from "./parseSchema";

const requiredFlag = ""; //".required()"
const defaultAdditionalFlag = ""; //".strip()"

export const parseObject = (schema: JSONSchema7 & { type: "object" }, ctx: ParseSchemaContext) => {
  return !schema.properties
    ? typeof schema.additionalProperties === "object"
      ? `z.record(${parseSchema(schema.additionalProperties, ctx)})`
      : "z.object({}).catchall(z.any())"
    : `z.object({${Object.entries(schema?.properties ?? {}).map(
        ([k, v]) => {
          ctx.currentPropertyKey = k;
          return `${JSON.stringify(k)}:${parseSchema(v, ctx)}${
            schema.required?.includes(k) ? requiredFlag : ".optional()"
          }`
        }
      )}})${
        schema.additionalProperties === true
          ? ".catchall(z.any())"
          : schema.additionalProperties === false
          ? ".strict()"
          : typeof schema.additionalProperties === "object"
          ? `.catchall(${parseSchema(schema.additionalProperties, ctx)})`
          : defaultAdditionalFlag
      }`;
};
