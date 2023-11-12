import { JSONSchema, JSONSchemaType } from "../Types";

export const parseConst = (
  schema: JSONSchema & { const: JSONSchemaType }
) => {
  return `z.literal(${JSON.stringify(schema.const)})`;
};
