import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { Refs } from '../Types';
import { its, parseSchema } from "./parseSchema";

export const parseMultipleType = (
  schema: JSONSchema7 & { type: JSONSchema7TypeName[] },
  refs: Refs
) => {
  let typeFiltered = schema.type.filter(type => type !== 'null');
  let hasNull = typeFiltered.length < schema.type.length;
  let only = typeFiltered.length === 1 ? typeFiltered[0] : null;

  return only ? `${parseSchema({ ...schema, type: only })}.nullable()` :  `z.union([${typeFiltered.map((type) =>
    parseSchema({ ...schema, type }, refs)
  )}])${hasNull ? ".nullable()" : ""}`;
};
