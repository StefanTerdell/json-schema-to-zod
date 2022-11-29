import { JSONSchema7 } from "json-schema";
import { parseAnyOf } from "./parseAnyOf";
import { parseOneOf } from "./parseOneOf";
import { its, parseSchema } from "./parseSchema";

const requiredFlag = ""; //".required()"
const defaultAdditionalFlag = ""; //".strip()"

export const parseObject = (
  schema: JSONSchema7 & { type: "object" },
  withoutDefaults?: boolean
) => {
  let result = !schema.properties
    ? typeof schema.additionalProperties === "object"
      ? `z.record(${parseSchema(schema.additionalProperties, withoutDefaults)})`
      : schema.additionalProperties === false
      ? "z.object({}).strict()"
      : "z.record(z.any())"
    : `z.object({${Object.entries(schema?.properties ?? {}).map(
        ([k, v]) =>
          `${JSON.stringify(k)}:${parseSchema(v, withoutDefaults)}${
            schema.required?.includes(k) ||
            (!withoutDefaults && v.hasOwnProperty("default"))
              ? requiredFlag
              : ".optional()"
          }`
      )}})${
        schema.additionalProperties === true
          ? ".catchall(z.any())"
          : schema.additionalProperties === false
          ? ".strict()"
          : typeof schema.additionalProperties === "object"
          ? `.catchall(${parseSchema(
              schema.additionalProperties,
              withoutDefaults
            )})`
          : defaultAdditionalFlag
      }`;

  if (its.an.anyOf(schema)) {
    result += `.and(${parseAnyOf(
      {
        ...schema,
        anyOf: schema.anyOf.map((x) =>
          typeof x === "object" &&
          !x.type &&
          (x.properties || x.additionalProperties)
            ? { ...x, type: "object" }
            : x
        ),
      },
      withoutDefaults
    )})`;
  }

  if (its.a.oneOf(schema)) {
    result += `.and(${parseOneOf(
      {
        ...schema,
        oneOf: schema.oneOf.map((x) =>
          typeof x === "object" &&
          !x.type &&
          (x.properties || x.additionalProperties)
            ? { ...x, type: "object" }
            : x
        ),
      },
      withoutDefaults
    )})`;
  }

  return result;
};
