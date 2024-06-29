import {
  JSONSchema4,
  JSONSchema6Definition,
  JSONSchema7Definition,
} from "json-schema";
import jsonSchemaToZod from "../src";
import { suite } from "./suite";

suite("jsonSchemaToZod", (test) => {
  test("should accept json schema 7 and 4", (assert) => {
    const schema = { type: "string" } as unknown;

    assert(jsonSchemaToZod(schema as JSONSchema4));
    assert(jsonSchemaToZod(schema as JSONSchema6Definition));
    assert(jsonSchemaToZod(schema as JSONSchema7Definition));
  });

  test("should produce a string of JS code creating a Zod schema from a simple JSON schema", (assert) => {
    assert(
      jsonSchemaToZod(
        {
          type: "string",
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.string()
`,
    );
  });

  test("should be possible to add types", (assert) => {
    assert(
      jsonSchemaToZod(
        {
          type: "string",
        },
        { name: "mySchema", module: "esm", type: true },
      ),
      `import { z } from "zod"

export const mySchema = z.string()
export type MySchema = z.infer<typeof mySchema>
`,
    );
  });

  test("should be possible to add types with a custom name template", (assert) => {
    assert(
      jsonSchemaToZod(
        {
          type: "string",
        },
        { name: "mySchema", module: "esm", type: "MyType" },
      ),
      `import { z } from "zod"

export const mySchema = z.string()
export type MyType = z.infer<typeof mySchema>
`,
    );
  });

  test("should throw when given module cjs and type", (assert) => {
    let didThrow = false;

    try {
      jsonSchemaToZod(
        { type: "string" },
        { name: "hello", module: "cjs", type: true },
      );
    } catch {
      didThrow = true;
    }

    assert(didThrow);
  });

  test("should throw when given type but no name", (assert) => {
    let didThrow = false;

    try {
      jsonSchemaToZod({ type: "string" }, { module: "esm", type: true });
    } catch {
      didThrow = true;
    }

    assert(didThrow);
  });

  test("should include defaults", (assert) => {
    assert(
      jsonSchemaToZod(
        {
          type: "string",
          default: "foo",
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.string().default("foo")
`,
    );
  });

  test("should include falsy defaults", (assert) => {
    assert(
      jsonSchemaToZod(
        {
          type: "string",
          default: "",
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.string().default("")
`,
    );
  });

  test("should include falsy defaults", (assert) => {
    assert(
      jsonSchemaToZod(
        {
          type: "string",
          const: "",
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.literal("")
`,
    );
  });

  test("can exclude defaults", (assert) => {
    assert(
      jsonSchemaToZod(
        {
          type: "string",
          default: "foo",
        },
        { module: "esm", withoutDefaults: true },
      ),
      `import { z } from "zod"

export default z.string()
`,
    );
  });

  test("will remove optionality if default is present", (assert) => {
    assert(
      jsonSchemaToZod(
        {
          type: "object",
          properties: {
            prop: {
              type: "string",
              default: "def",
            },
          },
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.object({ "prop": z.string().default("def") })
`,
    );
  });

  test("will handle falsy defaults", (assert) => {
    assert(
      jsonSchemaToZod(
        {
          type: "boolean",
          default: false,
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.boolean().default(false)
`,
    );
  });

  test("will ignore undefined as default", (assert) => {
    assert(
      jsonSchemaToZod(
        {
          type: "null",
          default: undefined,
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.null()
`,
    );
  });

  test("should be possible to define a custom parser", (assert) => {
    assert(
      jsonSchemaToZod(
        {
          allOf: [
            { type: "string" },
            { type: "number" },
            { type: "boolean", description: "foo" },
          ],
        },
        {
          // module: false,
          parserOverride: (schema, refs) => {
            if (
              refs.path.length === 2 &&
              refs.path[0] === "allOf" &&
              refs.path[1] === 2 &&
              schema.type === "boolean" &&
              schema.description === "foo"
            ) {
              return "myCustomZodSchema";
            }
          },
        },
      ),

      `z.intersection(z.string(), z.intersection(z.number(), myCustomZodSchema))`,
    );
  });

  test("can exclude name", (assert) => {
    assert(jsonSchemaToZod(true), "z.any()");
  });
});
