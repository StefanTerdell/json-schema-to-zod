import { JsonSchemaObject } from "../Types";

export const parseDefault = (_schema: JsonSchemaObject) => {
  return "z.any()";
};
