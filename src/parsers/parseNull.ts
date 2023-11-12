import { JsonSchemaObject } from "../Types";

export const parseNull = (_schema: JsonSchemaObject & { type: "null" }) => {
  return "z.null()";
};
