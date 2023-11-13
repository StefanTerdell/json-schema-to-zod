import { JsonSchemaObject } from "../Types.js";

export const parseDefault = (_schema: JsonSchemaObject) => {
  return "z.any()";
};
