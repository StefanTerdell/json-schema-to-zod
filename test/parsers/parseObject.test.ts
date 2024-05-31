import { JSONSchema7 } from "json-schema";
import { ZodError } from "zod";
import { parseObject } from "../../src/parsers/parseObject";
import { suite } from "../suite";

suite("parseObject", (test) => {
  test("With properties - should handle optional and required properties", (assert) => {
    assert(
      parseObject(
        {
          type: "object",
          required: ["myRequiredString"],
          properties: {
            myOptionalString: {
              type: "string",
            },
            myRequiredString: {
              type: "string",
            },
          },
        },
        { path: [], seen: new Map() },
      ),

      'z.object({ "myOptionalString": z.string().optional(), "myRequiredString": z.string() })',
    );
  });

  test("With properties - should handle additionalProperties when set to false", (assert) => {
    assert(
      parseObject(
        {
          type: "object",
          required: ["myString"],
          properties: {
            myString: {
              type: "string",
            },
          },
          additionalProperties: false,
        },
        { path: [], seen: new Map() },
      ),
      'z.object({ "myString": z.string() }).strict()',
    );
  });

  test("With properties - should handle additionalProperties when set to true", (assert) => {
    assert(
      parseObject(
        {
          type: "object",
          required: ["myString"],
          properties: {
            myString: {
              type: "string",
            },
          },
          additionalProperties: true,
        },
        { path: [], seen: new Map() },
      ),
      'z.object({ "myString": z.string() }).catchall(z.any())',
    );
  });

  test("With properties - should handle additionalProperties when provided a schema", (assert) => {
    assert(
      parseObject(
        {
          type: "object",
          required: ["myString"],
          properties: {
            myString: {
              type: "string",
            },
          },
          additionalProperties: { type: "number" },
        },
        { path: [], seen: new Map() },
      ),

      'z.object({ "myString": z.string() }).catchall(z.number())',
    );
  });

  test("Without properties - should handle additionalProperties when set to false", (assert) => {
    assert(
      parseObject(
        {
          type: "object",
          additionalProperties: false,
        },
        { path: [], seen: new Map() },
      ),
      "z.record(z.never())",
    );
  });

  test("Without properties - should handle additionalProperties when set to true", (assert) => {
    assert(
      parseObject(
        {
          type: "object",
          additionalProperties: true,
        },
        { path: [], seen: new Map() },
      ),
      "z.record(z.any())",
    );
  });

  test("Without properties - should handle additionalProperties when provided a schema", (assert) => {
    assert(
      parseObject(
        {
          type: "object",
          additionalProperties: { type: "number" },
        },

        { path: [], seen: new Map() },
      ),
      "z.record(z.number())",
    );
  });

  test("Without properties - should include falsy defaults", (assert) => {
    assert(
      parseObject(
        {
          type: "object",
          properties: {
            s: {
              type: "string",
              default: "",
            },
          },
        },
        { path: [], seen: new Map() },
      ),
      `z.object({ "s": z.string().default("") })`,
    );
  });

  test("eh", (assert) => {
    assert(
      parseObject(
        {
          type: "object",
          required: ["a"],
          properties: {
            a: {
              type: "string",
            },
          },
          anyOf: [
            {
              required: ["b"],
              properties: {
                b: {
                  type: "string",
                },
              },
            },
            {
              required: ["c"],
              properties: {
                c: {
                  type: "string",
                },
              },
            },
          ],
        },
        { path: [], seen: new Map() },
      ),

      'z.object({ "a": z.string() }).and(z.union([z.object({ "b": z.string() }), z.object({ "c": z.string() })]))',
    );

    assert(
      parseObject(
        {
          type: "object",
          required: ["a"],
          properties: {
            a: {
              type: "string",
            },
          },
          oneOf: [
            {
              required: ["b"],
              properties: {
                b: {
                  type: "string",
                },
              },
            },
            {
              required: ["c"],
              properties: {
                c: {
                  type: "string",
                },
              },
            },
          ],
        },
        { path: [], seen: new Map() },
      ),

      `z.object({ "a": z.string() }).and(z.any().superRefine((x, ctx) => {
    const schemas = [z.object({ "b": z.string() }), z.object({ "c": z.string() })];
    const errors = schemas.reduce<z.ZodError[]>(
      (errors, schema) =>
        ((result) =>
          result.error ? [...errors, result.error] : errors)(
          schema.safeParse(x),
        ),
      [],
    );
    if (schemas.length - errors.length !== 1) {
      ctx.addIssue({
        path: ctx.path,
        code: "invalid_union",
        unionErrors: errors,
        message: "Invalid input: Should pass single schema",
      });
    }
  }))`,
    );

    assert(
      parseObject(
        {
          type: "object",
          required: ["a"],
          properties: {
            a: {
              type: "string",
            },
          },
          allOf: [
            {
              required: ["b"],
              properties: {
                b: {
                  type: "string",
                },
              },
            },
            {
              required: ["c"],
              properties: {
                c: {
                  type: "string",
                },
              },
            },
          ],
        },
        { path: [], seen: new Map() },
      ),

      'z.object({ "a": z.string() }).and(z.intersection(z.object({ "b": z.string() }), z.object({ "c": z.string() })))',
    );
  });

  const run = (output: string, data: unknown) =>
    eval(
      `const {z} = require("zod"); ${output}.safeParse(${JSON.stringify(
        data,
      )})`,
    );

  test("Funcional tests - run", (assert) => {
    assert(run("z.string()", "hello"), {
      success: true,
      data: "hello",
    });
  });

  test("Funcional tests - properties", (assert) => {
    const schema: JSONSchema7 & { type: "object" } = {
      type: "object",
      required: ["a"],
      properties: {
        a: {
          type: "string",
        },
        b: {
          type: "number",
        },
      },
    };

    const expected =
      'z.object({ "a": z.string(), "b": z.number().optional() })';

    const result = parseObject(schema, { path: [], seen: new Map() });

    assert(result, expected);

    assert(run(result, { a: "hello" }), {
      success: true,
      data: {
        a: "hello",
      },
    });

    assert(run(result, { a: "hello", b: 123 }), {
      success: true,
      data: {
        a: "hello",
        b: 123,
      },
    });

    assert(run(result, { b: "hello", x: true }), {
      success: false,
      error: new ZodError([
        {
          code: "invalid_type",
          expected: "string",
          received: "undefined",
          path: ["a"],
          message: "Required",
        },
        {
          code: "invalid_type",
          expected: "number",
          received: "string",
          path: ["b"],
          message: "Expected number, received string",
        },
      ]),
    });
  });

  test("Funcional tests - properties and additionalProperties", (assert) => {
    const schema: JSONSchema7 & { type: "object" } = {
      type: "object",
      required: ["a"],
      properties: {
        a: {
          type: "string",
        },
        b: {
          type: "number",
        },
      },
      additionalProperties: { type: "boolean" },
    };

    const expected =
      'z.object({ "a": z.string(), "b": z.number().optional() }).catchall(z.boolean())';

    const result = parseObject(schema, { path: [], seen: new Map() });

    assert(result, expected);

    assert(run(result, { b: "hello", x: "true" }), {
      success: false,
      error: new ZodError([
        {
          code: "invalid_type",
          expected: "string",
          received: "undefined",
          path: ["a"],
          message: "Required",
        },
        {
          code: "invalid_type",
          expected: "number",
          received: "string",
          path: ["b"],
          message: "Expected number, received string",
        },
        {
          code: "invalid_type",
          expected: "boolean",
          received: "string",
          path: ["x"],
          message: "Expected boolean, received string",
        },
      ]),
    });
  });

  test("Funcional tests - properties, additionalProperties and patternProperties", (assert) => {
    const schema: JSONSchema7 & { type: "object" } = {
      type: "object",
      required: ["a"],
      properties: {
        a: {
          type: "string",
        },
        b: {
          type: "number",
        },
      },
      additionalProperties: { type: "boolean" },
      patternProperties: {
        "\\.": { type: "array" },
        "\\,": { type: "array", minItems: 1 },
      },
    };

    const expected = `z.object({ "a": z.string(), "b": z.number().optional() }).catchall(z.union([z.array(z.any()), z.array(z.any()).min(1), z.boolean()])).superRefine((value, ctx) => {
for (const key in value) {
let evaluated = ["a", "b"].includes(key)
if (key.match(new RegExp("\\\\."))) {
evaluated = true
const result = z.array(z.any()).safeParse(value[key])
if (!result.success) {
ctx.addIssue({
          path: [...ctx.path, key],
          code: 'custom',
          message: \`Invalid input: Key matching regex /\${key}/ must match schema\`,
          params: {
            issues: result.error.issues
          }
        })
}
}
if (key.match(new RegExp("\\\\,"))) {
evaluated = true
const result = z.array(z.any()).min(1).safeParse(value[key])
if (!result.success) {
ctx.addIssue({
          path: [...ctx.path, key],
          code: 'custom',
          message: \`Invalid input: Key matching regex /\${key}/ must match schema\`,
          params: {
            issues: result.error.issues
          }
        })
}
}
if (!evaluated) {
const result = z.boolean().safeParse(value[key])
if (!result.success) {
ctx.addIssue({
          path: [...ctx.path, key],
          code: 'custom',
          message: \`Invalid input: must match catchall schema\`,
          params: {
            issues: result.error.issues
          }
        })
}
}
}
})`;

    const result = parseObject(schema, { path: [], seen: new Map() });

    assert(result, expected);
  });

  test("Funcional tests - additionalProperties", (assert) => {
    const schema: JSONSchema7 & { type: "object" } = {
      type: "object",
      additionalProperties: { type: "boolean" },
    };

    const expected = "z.record(z.boolean())";

    const result = parseObject(schema, { path: [], seen: new Map() });

    assert(result, expected);
  });

  test("Funcional tests - additionalProperties and patternProperties", (assert) => {
    const schema: JSONSchema7 & { type: "object" } = {
      type: "object",
      additionalProperties: { type: "boolean" },
      patternProperties: {
        "\\.": { type: "array" },
        "\\,": { type: "array", minItems: 1 },
      },
    };

    const expected = `z.record(z.union([z.array(z.any()), z.array(z.any()).min(1), z.boolean()])).superRefine((value, ctx) => {
for (const key in value) {
let evaluated = false
if (key.match(new RegExp(\"\\\\.\"))) {
evaluated = true
const result = z.array(z.any()).safeParse(value[key])
if (!result.success) {
ctx.addIssue({
          path: [...ctx.path, key],
          code: 'custom',
          message: \`Invalid input: Key matching regex /\${key}/ must match schema\`,
          params: {
            issues: result.error.issues
          }
        })
}
}
if (key.match(new RegExp(\"\\\\,\"))) {
evaluated = true
const result = z.array(z.any()).min(1).safeParse(value[key])
if (!result.success) {
ctx.addIssue({
          path: [...ctx.path, key],
          code: 'custom',
          message: \`Invalid input: Key matching regex /\${key}/ must match schema\`,
          params: {
            issues: result.error.issues
          }
        })
}
}
if (!evaluated) {
const result = z.boolean().safeParse(value[key])
if (!result.success) {
ctx.addIssue({
          path: [...ctx.path, key],
          code: 'custom',
          message: \`Invalid input: must match catchall schema\`,
          params: {
            issues: result.error.issues
          }
        })
}
}
}
})`;

    const result = parseObject(schema, { path: [], seen: new Map() });

    assert(result, expected);

    assert(run(result, { x: true, ".": [], ",": [] }), {
      success: false,
      error: new ZodError([
        {
          path: [","],
          code: "custom",
          message: "Invalid input: Key matching regex /,/ must match schema",
          params: {
            issues: [
              {
                code: "too_small",
                minimum: 1,
                type: "array",
                inclusive: true,
                exact: false,
                message: "Array must contain at least 1 element(s)",
                path: [],
              },
            ],
          },
        },
      ]),
    });
  });

  test("Funcional tests - patternProperties", (assert) => {
    const schema: JSONSchema7 & { type: "object" } = {
      type: "object",
      patternProperties: {
        "\\.": { type: "array" },
        "\\,": { type: "array", minItems: 1 },
      },
    };

    const expected = `z.record(z.union([z.array(z.any()), z.array(z.any()).min(1)])).superRefine((value, ctx) => {
for (const key in value) {
if (key.match(new RegExp(\"\\\\.\"))) {
const result = z.array(z.any()).safeParse(value[key])
if (!result.success) {
ctx.addIssue({
          path: [...ctx.path, key],
          code: 'custom',
          message: \`Invalid input: Key matching regex /\${key}/ must match schema\`,
          params: {
            issues: result.error.issues
          }
        })
}
}
if (key.match(new RegExp(\"\\\\,\"))) {
const result = z.array(z.any()).min(1).safeParse(value[key])
if (!result.success) {
ctx.addIssue({
          path: [...ctx.path, key],
          code: 'custom',
          message: \`Invalid input: Key matching regex /\${key}/ must match schema\`,
          params: {
            issues: result.error.issues
          }
        })
}
}
}
})`;

    const result = parseObject(schema, { path: [], seen: new Map() });

    assert(run(result, { ".": [] }), {
      success: true,
      data: { ".": [] },
    });

    assert(run(result, { ",": [] }), {
      success: false,
      error: new ZodError([
        {
          path: [","],
          code: "custom",
          message: "Invalid input: Key matching regex /,/ must match schema",
          params: {
            issues: [
              {
                code: "too_small",
                minimum: 1,
                type: "array",
                inclusive: true,
                exact: false,
                message: "Array must contain at least 1 element(s)",
                path: [],
              },
            ],
          },
        },
      ]),
    });

    assert(result, expected);
  });

  test("Funcional tests - patternProperties and properties", (assert) => {
    const schema: JSONSchema7 & { type: "object" } = {
      type: "object",
      required: ["a"],
      properties: {
        a: {
          type: "string",
        },
        b: {
          type: "number",
        },
      },
      patternProperties: {
        "\\.": { type: "array" },
        "\\,": { type: "array", minItems: 1 },
      },
    };

    const expected = `z.object({ "a": z.string(), "b": z.number().optional() }).catchall(z.union([z.array(z.any()), z.array(z.any()).min(1)])).superRefine((value, ctx) => {
for (const key in value) {
if (key.match(new RegExp(\"\\\\.\"))) {
const result = z.array(z.any()).safeParse(value[key])
if (!result.success) {
ctx.addIssue({
          path: [...ctx.path, key],
          code: 'custom',
          message: \`Invalid input: Key matching regex /\${key}/ must match schema\`,
          params: {
            issues: result.error.issues
          }
        })
}
}
if (key.match(new RegExp(\"\\\\,\"))) {
const result = z.array(z.any()).min(1).safeParse(value[key])
if (!result.success) {
ctx.addIssue({
          path: [...ctx.path, key],
          code: 'custom',
          message: \`Invalid input: Key matching regex /\${key}/ must match schema\`,
          params: {
            issues: result.error.issues
          }
        })
}
}
}
})`;

    const result = parseObject(schema, { path: [], seen: new Map() });

    assert(result, expected);
  });
});
