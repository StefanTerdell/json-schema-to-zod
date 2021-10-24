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
