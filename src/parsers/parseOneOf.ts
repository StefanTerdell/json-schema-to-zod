import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { parseSchema } from "./parseSchema";

export const parseOneOf = (
  schema: JSONSchema7 & { oneOf: JSONSchema7Definition[] },withoutDefaults: boolean
) => {
  return `z.any().superRefine((x, ctx) => {
    const schemas = [${schema.oneOf.map(v => parseSchema(v, withoutDefaults))}];
    const errors = schemas.reduce(
      (errors: z.ZodError[], schema) =>
        ((result) => ("error" in result ? [...errors, result.error] : errors))(
          schema.safeParse(x)
        ),
      []
    );
    if (schemas.length - errors.length !== 1) {
      ctx.addIssue({
        path: ctx.path,
        code: "invalid_union",
        unionErrors: errors,
        message: "Invalid input: Should pass single schema",
      });
    }
  })`;
};
