import { parseOneOf } from "../../src/parsers/parseOneOf";
import { suite } from "../suite";

suite("parseOneOf", (test) => {
  test("should create a union from two or more schemas", (assert) => {
    assert(
      parseOneOf(
        {
          oneOf: [
            {
              type: "string",
            },
            { type: "number" },
          ],
        },
        { module: false, path: [], seen: new Map() },
      ),
      `z.any().superRefine((x, ctx) => {
    const schemas = [z.string(), z.number()];
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
  })`,
    );
  });

  test("should extract a single schema", (assert) => {
    assert(
      parseOneOf(
        { oneOf: [{ type: "string" }] },
        { module: false, path: [], seen: new Map() },
      ),
      "z.string()",
    );
  });

  test("should return z.any() if array is empty", (assert) => {
    assert(
      parseOneOf({ oneOf: [] }, { module: false, path: [], seen: new Map() }),
      "z.any()",
    );
  });
});
