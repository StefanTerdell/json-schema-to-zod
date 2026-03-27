import { JsonSchemaObject, JsonSchema, Refs } from "../Types.js";
import { parseSchema } from "./parseSchema.js";

export const parseOneOf = (
  schema: JsonSchemaObject & { oneOf: JsonSchema[] },
  refs: Refs,
) => {
  return schema.oneOf.length
    ? schema.oneOf.length === 1
      ? parseSchema(schema.oneOf[0], {
          ...refs,
          path: [...refs.path, "oneOf", 0],
        })
      : `z.any().superRefine((x, ctx) => {
    const schemas = [${schema.oneOf
      .map((schema, i) =>
        parseSchema(schema, {
          ...refs,
          path: [...refs.path, "oneOf", i],
        }),
      )
      .join(", ")}];
    const errors = schemas.reduce<z.ZodError[]>(
      (errors, schema) =>
        ((result) =>
          result.error ? [...errors, result.error] : errors)(
          schema.safeParse(x),
        ),
      [],
    );
    if (schemas.length - errors.length !== 1) {
      ctx.addIssue(errors.length ? {
        path: ${refs.zodVersion === 3 ? 'ctx.path' : '[]' },
        code: "invalid_union",
        ${refs.zodVersion === 3 ? 'unionErrors: ' : ''}errors,
        message: "Invalid input: Should pass single schema",
      } : {
        path: ${refs.zodVersion === 3 ? 'ctx.path' : '[]' },
        code: "custom",${refs.zodVersion === 3 ? "" : "\n        errors,"}
        message: "Invalid input: Should pass single schema",
      });
    }
  })`
    : "z.any()";
};
