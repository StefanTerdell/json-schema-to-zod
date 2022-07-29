import { parseAnyOf } from "./parseAnyOf";
import { parseBoolean } from "./parseBoolean";
import { parseDefault } from "./parseDefault";
import { parseMultipleType } from "./parseMultipleType";
import { parseNot } from "./parseNot";
import { parseNull } from "./parseNull";
import { parseAllOf } from "./parseAllOf";
import { parseArray } from "./parseArray";
import { parseConst } from "./parseConst";
import { parseEnum } from "./parseEnum";
import { parseIfThenElse } from "./parseIfThenElse";
import { parseNumber } from "./parseNumber";
import { parseObject } from "./parseObject";
import { parseString } from "./parseString";
import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type,
  JSONSchema7TypeName,
} from "json-schema";
import { parseOneOf } from "./parseOneOf";

export const parseSchema = (schema: JSONSchema7 | boolean): string => {
  if (typeof schema !== "object") return "z.unknown()";
  let parsed = selectParser(schema);
  parsed = addMeta(schema, parsed);
  return parsed;
};

const addMeta = (schema: JSONSchema7, parsed: string): string => {
  if (schema.description)
    parsed += `.describe(${JSON.stringify(schema.description)})`;
  return parsed;
};

const selectParser = (schema: JSONSchema7): string => {
  if (its.an.object(schema)) {
    return parseObject(schema);
  } else if (its.an.array(schema)) {
    return parseArray(schema);
  } else if (its.an.anyOf(schema)) {
    return parseAnyOf(schema);
  } else if (its.an.allOf(schema)) {
    return parseAllOf(schema);
  } else if (its.a.oneOf(schema)) {
    return parseOneOf(schema);
  } else if (its.a.not(schema)) {
    return parseNot(schema);
  } else if (its.an.enum(schema)) {
    return parseEnum(schema); //<-- needs to come before primitives
  } else if (its.a.const(schema)) {
    return parseConst(schema);
  } else if (its.a.multipleType(schema)) {
    return parseMultipleType(schema);
  } else if (its.a.primitive(schema, "string")) {
    return parseString(schema);
  } else if (
    its.a.primitive(schema, "number") ||
    its.a.primitive(schema, "integer")
  ) {
    return parseNumber(schema);
  } else if (its.a.primitive(schema, "boolean")) {
    return parseBoolean(schema);
  } else if (its.a.primitive(schema, "null")) {
    return parseNull(schema);
  } else if (its.a.conditional(schema)) {
    return parseIfThenElse(schema);
  } else {
    return parseDefault(schema);
  }
};

const its = {
  an: {
    object: (x: JSONSchema7): x is JSONSchema7 & { type: "object" } =>
      x.type === "object",
    array: (x: JSONSchema7): x is JSONSchema7 & { type: "array" } =>
      x.type === "array",
    anyOf: (
      x: JSONSchema7
    ): x is JSONSchema7 & {
      anyOf: JSONSchema7Definition[];
    } => !!x.anyOf,
    allOf: (
      x: JSONSchema7
    ): x is JSONSchema7 & {
      allOf: JSONSchema7Definition[];
    } => !!x.allOf,
    enum: (
      x: JSONSchema7
    ): x is JSONSchema7 & {
      enum: JSONSchema7Type | JSONSchema7Type[];
    } => !!x.enum,
  },
  a: {
    multipleType: (
      x: JSONSchema7
    ): x is JSONSchema7 & { type: JSONSchema7TypeName[] } =>
      Array.isArray(x.type),
    not: (
      x: JSONSchema7
    ): x is JSONSchema7 & {
      not: JSONSchema7Definition;
    } => !!x.not,
    const: (
      x: JSONSchema7
    ): x is JSONSchema7 & {
      const: JSONSchema7Type;
    } => !!x.const,
    primitive: <T extends "string" | "number" | "integer" | "boolean" | "null">(
      x: JSONSchema7,
      p: T
    ): x is JSONSchema7 & { type: T } => x.type === p,
    conditional: (
      x: JSONSchema7
    ): x is JSONSchema7 & {
      if: JSONSchema7Definition;
      then: JSONSchema7Definition;
      else: JSONSchema7Definition;
    } => Boolean(x.if && x.then && x.else),
    oneOf: (
      x: JSONSchema7
    ): x is JSONSchema7 & {
      oneOf: JSONSchema7Definition[];
    } => !!x.oneOf,
  },
};
