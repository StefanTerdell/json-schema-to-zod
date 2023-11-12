import { JSONSchema } from "../Types";

export const parseDefault = (_schema: JSONSchema) => {
  return "z.any()";
};
