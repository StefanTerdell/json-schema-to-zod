import { parseSchema } from "../../src/parsers/parseSchema";

describe("parseSchema", () => {
  it("should parse a number with the default parser", () => {
    expect(
      parseSchema(
        {
          type: "object",
          required: ["myRequiredString"],
          properties: {
            myNumber: {
              type: "number",
            },
          },
        },
        false
      )
    ).toStrictEqual(
      'z.object({"myNumber":z.number().optional()})'
    );

  });
  it("parses a number with a custom parser", () => {
    expect(
      parseSchema(
        {
          type: "object",
          required: ["myRequiredString"],
          properties: {
            myNumber: {
              type: "number",
            },
          },
        },
        false,
        {
          number: (
            schema
          ) => {
            let r = "z.coerce.number()";
            return r;
          }
        }
      )
    ).toStrictEqual(
      'z.object({"myNumber":z.coerce.number().optional()})'
    );

  });
});
