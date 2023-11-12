import { JSONSchema7 } from "json-schema";
import { ZodError } from "zod";
import { parseObject } from "../../src/parsers/parseObject";

describe("parseObject", () => {
  describe("With properties", () => {
    it("should handle optional and required properties", () => {
      expect(
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
          { module: false, path: [], seen: new Map() },
        ),
      ).toStrictEqual(
        'z.object({ "myOptionalString": z.string().optional(), "myRequiredString": z.string() })',
      );
    });

    it("should handle additionalProperties when set to false", () => {
      expect(
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
          { module: false, path: [], seen: new Map() },
        ),
      ).toStrictEqual('z.object({ "myString": z.string() }).strict()');
    });

    it("should handle additionalProperties when set to true", () => {
      expect(
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
          { module: false, path: [], seen: new Map() },
        ),
      ).toStrictEqual('z.object({ "myString": z.string() }).catchall(z.any())');
    });

    it("should handle additionalProperties when provided a schema", () => {
      expect(
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
          { module: false, path: [], seen: new Map() },
        ),
      ).toStrictEqual(
        'z.object({ "myString": z.string() }).catchall(z.number())',
      );
    });
  });

  describe("Without properties", () => {
    it("should handle additionalProperties when set to false", () => {
      expect(
        parseObject(
          {
            type: "object",
            additionalProperties: false,
          },
          { module: false, path: [], seen: new Map() },
        ),
      ).toStrictEqual("z.record(z.never())");
    });

    it("should handle additionalProperties when set to true", () => {
      expect(
        parseObject(
          {
            type: "object",
            additionalProperties: true,
          },
          { module: false, path: [], seen: new Map() },
        ),
      ).toStrictEqual("z.record(z.any())");
    });

    it("should handle additionalProperties when provided a schema", () => {
      expect(
        parseObject(
          {
            type: "object",
            additionalProperties: { type: "number" },
          },

          { module: false, path: [], seen: new Map() },
        ),
      ).toStrictEqual("z.record(z.number())");
    });

    it("should include falsy defaults", () => {
      expect(
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
          { module: false, path: [], seen: new Map() },
        ),
      ).toStrictEqual(`z.object({ "s": z.string().default("") })`);
    });
  });

  describe("with nested unions", () => {
    expect(
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
        { module: false, path: [], seen: new Map() },
      ),
    ).toStrictEqual(
      'z.object({ "a": z.string() }).and(z.union([z.object({ "b": z.string() }), z.object({ "c": z.string() })]))',
    );

    expect(
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
        { module: false, path: [], seen: new Map() },
      ),
    ).toStrictEqual(
      `z.object({ "a": z.string() }).and(z.any().superRefine((x, ctx) => {
    const schemas = [z.object({ "b": z.string() }), z.object({ "c": z.string() })];
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
  }))`,
    );

    expect(
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
        { module: false, path: [], seen: new Map() },
      ),
    ).toStrictEqual(
      'z.object({ "a": z.string() }).and(z.intersection(z.object({ "b": z.string() }), z.object({ "c": z.string() })))',
    );
  });

  describe("functional tests", () => {
    const run = (output: string, data: unknown) =>
      eval(
        `const {z} = require("zod"); ${output}.safeParse(${JSON.stringify(
          data,
        )})`,
      );

    test("run", () => {
      expect(run("z.string()", "hello")).toStrictEqual({
        success: true,
        data: "hello",
      });
    });

    test("properties", () => {
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

      expect(result).toStrictEqual(expected);

      expect(run(result, { a: "hello" })).toStrictEqual({
        success: true,
        data: {
          a: "hello",
        },
      });

      expect(run(result, { a: "hello", b: 123 })).toStrictEqual({
        success: true,
        data: {
          a: "hello",
          b: 123,
        },
      });

      expect(run(result, { b: "hello", x: true })).toStrictEqual({
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

    test("properties and additionalProperties", () => {
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

      expect(result).toStrictEqual(expected);

      expect(run(result, { b: "hello", x: "true" })).toStrictEqual({
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

    test("properties, additionalProperties and patternProperties", () => {
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

      expect(result).toStrictEqual(expected);
    });

    test("additionalProperties", () => {
      const schema: JSONSchema7 & { type: "object" } = {
        type: "object",
        additionalProperties: { type: "boolean" },
      };

      const expected = "z.record(z.boolean())";

      const result = parseObject(schema, { path: [], seen: new Map() });

      expect(result).toStrictEqual(expected);
    });

    test("additionalProperties and patternProperties", () => {
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

      expect(result).toStrictEqual(expected);

      expect(run(result, { x: true, ".": [], ",": [] })).toStrictEqual({
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

    test("patternProperties", () => {
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

      expect(run(result, { ".": [] })).toStrictEqual({
        success: true,
        data: { ".": [] },
      });

      expect(run(result, { ",": [] })).toStrictEqual({
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

      expect(result).toStrictEqual(expected);
    });

    test("patternProperties and properties", () => {
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

      expect(result).toStrictEqual(expected);
    });
  });
});
