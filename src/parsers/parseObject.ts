import { JSONSchema7 } from "json-schema";
import { parseAnyOf } from "./parseAnyOf";
import { parseOneOf } from "./parseOneOf";
import { its, parseSchema } from "./parseSchema";

const requiredFlag = ""; //".required()"
const defaultAdditionalFlag = ""; //".strip()"

export const parseObject = (schema: JSONSchema7 & { type: "object" }) => {
  let result = !schema.properties
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

  if (its.an.anyOf(schema)) {
    result += `.and(${parseAnyOf({
      ...schema,
      anyOf: schema.anyOf.map((x) =>
        typeof x === "object" &&
        !x.type &&
        (x.properties || x.additionalProperties)
          ? { ...x, type: "object" }
          : x
      ),
    })})`;
  }

  if (its.a.oneOf(schema)) {
    result += `.and(${parseOneOf({
      ...schema,
      oneOf: schema.oneOf.map((x) =>
        typeof x === "object" &&
        !x.type &&
        (x.properties || x.additionalProperties)
          ? { ...x, type: "object" }
          : x
      ),
    })})`;
  }

  return result;
};
