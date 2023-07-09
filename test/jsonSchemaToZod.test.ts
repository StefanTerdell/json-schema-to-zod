import jsonSchemaToZod, { jsonSchemaToZodDereffed } from "../src";

describe("jsonSchemaToZod", () => {
  it("should produce a string of JS code creating a Zod schema from a simple JSON schema", () => {
    expect(
      jsonSchemaToZod({
        type: "string",
      })
    ).toStrictEqual(`import { z } from "zod";

export default z.string();
`);
  });

  it("should include defaults", () => {
    expect(
      jsonSchemaToZod({
        type: "string",
        default: "foo",
      })
    ).toStrictEqual(`import { z } from "zod";

export default z.string().default("foo");
`);
  });

  it("should include falsy defaults", () => {
    expect(
      jsonSchemaToZod({
        type: "string",
        default: "",
      })
    ).toStrictEqual(`import { z } from "zod";

export default z.string().default("");
`);
  });

  it("should include falsy defaults", () => {
    expect(
      jsonSchemaToZod({
        type: "string",
        const: "",
      })
    ).toStrictEqual(`import { z } from "zod";

export default z.literal("");
`);
  });

  it("can exclude defaults", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
          default: "foo",
        },
        { module: true, withoutDefaults: true }
      )
    ).toStrictEqual(`import { z } from "zod";

export default z.string();
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
      })
    ).toStrictEqual(`import { z } from "zod";

export default z.object({ prop: z.string().default("def") });
`);
  });

  it("will handle falsy defaults", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "boolean",
          default: false,
        },
        { module: true }
      )
    ).toStrictEqual(`import { z } from "zod";

export default z.boolean().default(false);
`);
  });

  it("will ignore undefined as default", () => {
    expect(
      jsonSchemaToZod({
        type: "null",
        default: undefined,
      })
    ).toStrictEqual(`import { z } from "zod";

export default z.null();
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
        }
      )
    ).toStrictEqual(`const schema = z.intersection(
  z.string(),
  z.intersection(z.number(), myCustomZodSchema)
);
`);
  });

  it("should handle the $ref structure from zod-to-json-schema", async () => {
    expect(
      await jsonSchemaToZodDereffed({
        $ref: "#/definitions/hello",
        definitions: {
          hello: {
            type: "string",
          },
        },
      })
    ).toStrictEqual(`import { z } from "zod";

export default z.string();
`);
  });

  it("should deal with some basic recursive schemas", async () => {
    expect(
      await jsonSchemaToZodDereffed(
        {
          type: "object",
          properties: { rec1: { $ref: "#" }, rec2: { $ref: "#" } },
        },
        { recursionDepth: 1 }
      )
    ).toStrictEqual(
      `import { z } from "zod";

export default z.object({
  rec1: z
    .object({ rec1: z.any().optional(), rec2: z.any().optional() })
    .optional(),
  rec2: z
    .object({ rec1: z.any().optional(), rec2: z.any().optional() })
    .optional(),
});
`
    );
  });
});
