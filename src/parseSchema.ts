import { parseAnyOf } from "./parsers/parseAnyOf";
import { parseBoolean } from "./parsers/parseBoolean";
import { parseDefault } from "./parsers/parseDefault";
import { parseMultipleType } from "./parsers/parseMultipleType";
import { parseNot } from "./parsers/parseNot";
import { parseNull } from "./parsers/parseNull";
import { parseAllOf } from "./parsers/parseAllOf";
import { parseArray } from "./parsers/parseArray";
import { parseConst } from "./parsers/parseConst";
import { parseEnum } from "./parsers/parseEnum";
import { parseIfThenElse } from "./parsers/parseIfThenElse";
import { parseNumber } from "./parsers/parseNumber";
import { parseObject } from "./parsers/parseObject";
import { parseString } from "./parsers/parseString";

export const parseSchema = (schema: any): string => {
  if (schema.type === "object") {
    return parseObject(schema);
  } else if (schema.type === "array") {
    return parseArray(schema);
  } else if (Array.isArray(schema.type)) {
    return parseMultipleType(schema);
  } else if (schema.anyOf) {
    return parseAnyOf(schema);
  } else if (schema.allOf) {
    return parseAllOf(schema);
  } else if (schema.not) {
    return parseNot(schema);
  } else if (schema.enum) {
    return parseEnum(schema); //<-- needs to come before primitives
  } else if (schema.const) {
    return parseConst(schema);
  } else if (schema.type === "string") {
    return parseString(schema);
  } else if (schema.type === "number") {
    return parseNumber(schema);
  } else if (schema.type === "boolean") {
    return parseBoolean(schema);
  } else if (schema.type === "null") {
    return parseNull(schema);
  } else if (schema.if && schema.then && schema.else) {
    return parseIfThenElse(schema);
  } else {
    return parseDefault(schema);
  }
};
