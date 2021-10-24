import { JSONSchema7 } from "json-schema";

export const parseNumber = (schema: JSONSchema7 & { type: "number" }) => {
  let r = "z.number()";
  if (schema.format === "int64" || schema.multipleOf === 1) r += ".int()";
  if (schema.multipleOf !== undefined && schema.multipleOf !== 1) {
    r += `.multipleOf(${schema.multipleOf})`;
  }
  if (schema.minimum !== undefined) r += `.gte(${schema.minimum})`;
  if (schema.maximum !== undefined) r += `.lte(${schema.maximum})`;
  if (schema.exclusiveMinimum !== undefined)
    r += `.gt(${schema.exclusiveMinimum})`;
  if (schema.exclusiveMaximum !== undefined)
    r += `.lt(${schema.exclusiveMaximum})`;
  return r;
};
