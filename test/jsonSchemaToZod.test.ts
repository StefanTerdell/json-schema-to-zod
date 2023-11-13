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
      jsonSchemaToZod({
        type: "string",
      }),
      `import { z } from "zod"

export default z.string()
`,
    );
  });

  test("should include defaults", (assert) => {
    assert(
      jsonSchemaToZod({
        type: "string",
        default: "foo",
      }),
      `import { z } from "zod"

export default z.string().default("foo")
`,
    );
  });

  test("should include falsy defaults", (assert) => {
    assert(
      jsonSchemaToZod({
        type: "string",
        default: "",
      }),
      `import { z } from "zod"

export default z.string().default("")
`,
    );
  });

  test("should include falsy defaults", (assert) => {
    assert(
      jsonSchemaToZod({
        type: "string",
        const: "",
      }),
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
        { module: true, withoutDefaults: true },
      ),
      `import { z } from "zod"

export default z.string()
`,
    );
  });

  test("will remove optionality if default is present", (assert) => {
    assert(
      jsonSchemaToZod({
        type: "object",
        properties: {
          prop: {
            type: "string",
            default: "def",
          },
        },
      }),
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
        { module: true },
      ),
      `import { z } from "zod"

export default z.boolean().default(false)
`,
    );
  });

  test("will ignore undefined as default", (assert) => {
    assert(
      jsonSchemaToZod({
        type: "null",
        default: undefined,
      }),
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
          module: false,
          overrideParser: (schema, refs) => {
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

      `const schema = z.intersection(z.string(), z.intersection(z.number(), myCustomZodSchema))`,
    );
  });
});
