import { JSONSchema } from "../Types";

export const parseBoolean = (_schema: JSONSchema & { type: "boolean" }) => {
  return "z.boolean()";
};
