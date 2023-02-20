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
import { parseNullable } from "./parseNullable";

export type Parser<T = any> = (
  schema: JSONSchema7 & T,
  withoutDefaults?: boolean,
  parsers?: Record<string, Parser>
) => string

export const parseSchema = (
  schema: JSONSchema7 | boolean,
  withoutDefaults?: boolean,
  customParsers: Record<string, Parser> = {}
): string => {
  if (typeof schema !== "object") return "z.unknown()";
  let parsed = selectParser(schema, withoutDefaults, customParsers);
  parsed = addMeta(schema, parsed);
  if (!withoutDefaults) {
    parsed = addDefaults(schema, parsed);
  }
  return parsed;
};

const addMeta = (schema: JSONSchema7, parsed: string): string => {
  if (schema.description)
    parsed += `.describe(${JSON.stringify(schema.description)})`;
  return parsed;
};

const addDefaults = (schema: JSONSchema7, parsed: string): string => {
  if (schema.default !== undefined) {
    parsed += `.default(${JSON.stringify(schema.default)})`;
  }
  return parsed;
};

const selectParser = (
  schema: JSONSchema7,
  withoutDefaults?: boolean,
  customParsers: Record<string, Parser> = {}
): string => {
  // Must be defined within the function to avoid breakages due to circular dependencies
  const defaultParsers: Record<string, Parser> = {
    'allOf': parseAllOf,
    'anyOf': parseAnyOf,
    'array': parseArray,
    'boolean': parseBoolean,
    'const': parseConst,
    'conditional': parseIfThenElse,
    'enum': parseEnum,
    'integer': parseNumber,
    'multipleType': parseMultipleType,
    'not': parseNot,
    'null': parseNull,
    'nullable': parseNullable,
    'number': parseNumber,
    'object': parseObject,
    'oneOf': parseOneOf,
    'string': parseString,
    // Fallback case:
    'default': parseDefault,
  }
  const parsers = { ...defaultParsers, ...customParsers }

  if (its.a.nullable(schema)) {
    return parsers.nullable(schema, withoutDefaults, customParsers);
  } else if (its.an.object(schema)) {
    return parsers.object(schema, withoutDefaults, customParsers);
  } else if (its.an.array(schema)) {
    return parsers.array(schema, withoutDefaults, customParsers);
  } else if (its.an.anyOf(schema)) {
    return parsers.anyOf(schema, withoutDefaults, customParsers);
  } else if (its.an.allOf(schema)) {
    return parsers.allOf(schema, withoutDefaults, customParsers);
  } else if (its.a.oneOf(schema)) {
    return parsers.oneOf(schema, withoutDefaults, customParsers);
  } else if (its.a.not(schema)) {
    return parsers.not(schema, withoutDefaults, customParsers);
  } else if (its.an.enum(schema)) {
    return parsers.enum(schema, withoutDefaults, customParsers); //<-- needs to come before primitives
  } else if (its.a.const(schema)) {
    return parsers.const(schema, withoutDefaults, customParsers);
  } else if (its.a.multipleType(schema)) {
    return parsers.multipleType(schema, withoutDefaults, customParsers);
  } else if (its.a.primitive(schema, "string")) {
    return parsers.string(schema, withoutDefaults, customParsers);
  } else if (its.a.primitive(schema, "number")) {
    return parsers.number(schema, withoutDefaults, customParsers);
  } else if (its.a.primitive(schema, "integer")) {
    return parsers.integer(schema, withoutDefaults, customParsers);
  } else if (its.a.primitive(schema, "boolean")) {
    return parsers.boolean(schema, withoutDefaults, customParsers);
  } else if (its.a.primitive(schema, "null")) {
    return parsers.null(schema, withoutDefaults, customParsers);
  } else if (its.a.conditional(schema)) {
    return parsers.conditional(schema, withoutDefaults, customParsers);
  } else {
    return parsers.default(schema, withoutDefaults, customParsers);
  }
};

export const its = {
  an: {
    object: (x: JSONSchema7): x is JSONSchema7 & { type: "object" } =>
      x.type === "object",
    array: (x: JSONSchema7): x is JSONSchema7 & { type: "array" } =>
      x.type === "array",
    anyOf: (
      x: JSONSchema7
    ): x is JSONSchema7 & {
      anyOf: JSONSchema7Definition[];
    } => x.anyOf !== undefined,
    allOf: (
      x: JSONSchema7
    ): x is JSONSchema7 & {
      allOf: JSONSchema7Definition[];
    } => x.allOf !== undefined,
    enum: (
      x: JSONSchema7
    ): x is JSONSchema7 & {
      enum: JSONSchema7Type | JSONSchema7Type[];
    } => x.enum !== undefined,
  },
  a: {
    nullable: (x: JSONSchema7): x is JSONSchema7 & { nullable: true } =>
      (x as any).nullable === true,
    multipleType: (
      x: JSONSchema7
    ): x is JSONSchema7 & { type: JSONSchema7TypeName[] } =>
      Array.isArray(x.type),
    not: (
      x: JSONSchema7
    ): x is JSONSchema7 & {
      not: JSONSchema7Definition;
    } => x.not !== undefined,
    const: (
      x: JSONSchema7
    ): x is JSONSchema7 & {
      const: JSONSchema7Type;
    } => x.const !== undefined,
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
    } => x.oneOf !== undefined,
  },
};
