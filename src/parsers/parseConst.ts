import { JsonSchemaObject, Serializable } from "../Types.js";

export const parseConst = (
  schema: JsonSchemaObject & { const: Serializable },
) => {
  return `z.literal(${JSON.stringify(schema.const)})`;
};
