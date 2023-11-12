import { JSONSchema } from "../Types";

export const parseNull = (_schema: JSONSchema & { type: "null" }) => {
  return "z.null()";
};
