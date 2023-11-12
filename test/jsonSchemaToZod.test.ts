import {
  JSONSchema4,
  JSONSchema6Definition,
  JSONSchema7Definition,
} from "json-schema";
import jsonSchemaToZod from "../src";

describe("jsonSchemaToZod", () => {
  it("should accept json schema 7 and 4", () => {
    const schema = { type: "string" } as unknown;

    expect(jsonSchemaToZod(schema as JSONSchema4));
    expect(jsonSchemaToZod(schema as JSONSchema6Definition));
    expect(jsonSchemaToZod(schema as JSONSchema7Definition));
  });

  it("should produce a string of JS code creating a Zod schema from a simple JSON schema", () => {
    expect(
      jsonSchemaToZod({
        type: "string",
      }),
    ).toStrictEqual(`import { z } from "zod"

export default z.string()
`);
  });

  it("should include defaults", () => {
    expect(
      jsonSchemaToZod({
        type: "string",
        default: "foo",
      }),
    ).toStrictEqual(`import { z } from "zod"

export default z.string().default("foo")
`);
  });

  it("should include falsy defaults", () => {
    expect(
      jsonSchemaToZod({
        type: "string",
        default: "",
      }),
    ).toStrictEqual(`import { z } from "zod"

export default z.string().default("")
`);
  });

  it("should include falsy defaults", () => {
    expect(
      jsonSchemaToZod({
        type: "string",
        const: "",
      }),
    ).toStrictEqual(`import { z } from "zod"

export default z.literal("")
`);
  });

  it("can exclude defaults", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
          default: "foo",
        },
        { module: true, withoutDefaults: true },
      ),
    ).toStrictEqual(`import { z } from "zod"

export default z.string()
`);
  });

  it("will remove optionality if default is present", () => {
    expect(
      jsonSchemaToZod({
        type: "object",
        properties: {
          prop: {
            type: "string",
            default: "def",
          },
        },
      }),
    ).toStrictEqual(`import { z } from "zod"

export default z.object({ "prop": z.string().default("def") })
`);
  });

  it("will handle falsy defaults", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "boolean",
          default: false,
        },
        { module: true },
      ),
    ).toStrictEqual(`import { z } from "zod"

export default z.boolean().default(false)
`);
  });

  it("will ignore undefined as default", () => {
    expect(
      jsonSchemaToZod({
        type: "null",
        default: undefined,
      }),
    ).toStrictEqual(`import { z } from "zod"

export default z.null()
`);
  });

  it("should be possible to define a custom parser", () => {
    expect(
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
    ).toStrictEqual(`const schema = z.intersection(z.string(), z.intersection(z.number(), myCustomZodSchema))`);
  });
});
