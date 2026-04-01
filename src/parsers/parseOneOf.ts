import { JsonSchemaObject, JsonSchema, Refs } from "../Types.js";
import { parseSchema } from "./parseSchema.js";

export const parseOneOf = (
  schema: JsonSchemaObject & { oneOf: JsonSchema[] },
  refs: Refs,
) => {
  let is3 = refs.zodVersion === 3;

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
    const { errors, failed } = schemas.reduce<{
      errors: z.${is3 ? "ZodError" : "core.$ZodIssue"}[];
      failed: number;
    }>(
      ({ errors, failed }, schema) =>
        ((result) =>
          result.error
            ? {
                errors: [...errors, ${is3 ? "result.error" : "...result.error.issues"}],
                failed: failed + 1,
              }
            : { errors, failed })(
          schema.safeParse(x),
        ),
      { errors: [], failed: 0 },
    );
    const passed = schemas.length - failed;
    if (passed !== 1) {
      ctx.addIssue(errors.length ? {
        path: ${is3 ? "ctx.path" : "[]"},
        code: "invalid_union",
        ${is3 ? "unionErrors: errors" : "errors: [errors]"},
        message: "Invalid input: Should pass single schema. Passed " + passed,
      } : {
        path: ${is3 ? "ctx.path" : "[]"},
        code: "custom",${is3 ? "" : "\n        errors: [errors],"}
        message: "Invalid input: Should pass single schema. Passed " + passed,
      });
    }
  })`
    : "z.any()";
};
