import jsonSchemaToZod from "../src";

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

  it("can exclude defaults", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
          default: "foo",
        },
        undefined,
        true,
        true
      )
    ).toStrictEqual(`import { z } from "zod";

export default z.string();
`);
  });

  it("will remove optionality if default is present", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "object",
          properties: {
              prop: {
                  type: "string",
                  default: 'def'
              }
          }
        }
      )
    ).toStrictEqual(`import { z } from "zod";

export default z.object({ prop: z.string().default("def") });
`);
  });

  it("will handle falsy defaults", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "boolean",
          default: false
        }
      )
    ).toStrictEqual(`import { z } from "zod";

export default z.boolean().default(false);
`);
  });
});
