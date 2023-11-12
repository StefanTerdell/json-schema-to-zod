import { JsonSchemaObject } from "../Types";

export const parseBoolean = (
  _schema: JsonSchemaObject & { type: "boolean" },
) => {
  return "z.boolean()";
};
