import { JsonSchemaObject } from "../Types.js";

export const parseNull = (_schema: JsonSchemaObject & { type: "null" }) => {
  return "z.null()";
};
