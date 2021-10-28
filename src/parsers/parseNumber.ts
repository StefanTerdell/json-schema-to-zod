import { JSONSchema7 } from "json-schema";

export const parseNumber = (
  schema: JSONSchema7 & { type: "number" | "integer" }
) => {
  let r = "z.number()";
  if (
    schema.format === "int64" ||
    schema.multipleOf === 1 ||
    schema.type === "integer"
  ) {
    r += ".int()";
  }
  
  if (schema.multipleOf !== undefined && schema.multipleOf !== 1) {
    r += `.multipleOf(${schema.multipleOf})`;
  }

  if (schema.minimum !== undefined) {
    if ((schema as any).exclusiveMinimum === true) {
      r += `.gt({${schema.minimum}})`;
    } else {
      r += `.gte(${schema.minimum})`;
    }
  } else if (
    schema.exclusiveMinimum !== undefined &&
    (schema as any).exclusiveMinimum !== false
  ) {
    r += `.gt(${schema.exclusiveMinimum})`;
  }

  if (schema.maximum !== undefined) {
    if ((schema as any).exclusiveMaximum === true) {
      r += `.lt({${schema.maximum}})`;
    } else {
      r += `.lte(${schema.maximum})`;
    }
  } else if (
    schema.exclusiveMaximum !== undefined &&
    (schema as any).exclusiveMaximum !== false
  ) {
    r += `.lt(${schema.exclusiveMaximum})`;
  }
  return r;
};
