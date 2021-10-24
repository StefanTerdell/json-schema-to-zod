import { parseArray } from "./parsers/parseArray";
import { parseEnum } from "./parsers/parseEnum";
import { parseNumber } from "./parsers/parseNumber";
import { parseObject } from "./parsers/parseObject";
import { parseAllOf } from "./parsers/parseAllOf";
import { parseString } from "./parsers/parseString";
import { parseIfThenElse } from "./parsers/parseIfThenElse";

//TODO: const

export const parseSchema = (schema: any): string => {
  if (schema.type === "object") {
    return parseObject(schema);
  } else if (schema.type === "array") {
    return parseArray(schema);
  } else if (Array.isArray(schema.type)) {
    return `z.union([${schema.type.map(parseSchema)}])`;
  } else if (schema.anyOf) {
    return `z.union([${schema.anyOf.map(parseSchema)}])`;
  } else if (schema.allOf) {
    return parseAllOf(schema.allOf);
  } else if (schema.not) {
    return "z.undefined()";
  } else if (schema.enum) {
    return parseEnum(schema); //<-- needs to come before primitives
  } else if (schema.type === "string") {
    return parseString(schema);
  } else if (schema.type === "number") {
    return parseNumber(schema);
  } else if (schema.type === "boolean") {
    return "z.boolean()";
  } else if (schema.type === "null") {
    return "z.null()";
  } else if (schema.if && schema.then && schema.else) {
    return parseIfThenElse(schema);
  } else {
    return "z.any()";
  }
};
