import { parseString } from "../../src/parsers/parseString";

describe("parseString", () => {
  const run = (output: string, data: unknown) =>
    eval(
      `const {z} = require("zod"); ${output}.safeParse(${JSON.stringify(
        data,
      )})`,
    );

  test("DateTime format", () => {
    const datetime = "2018-11-13T20:20:39Z";

    expect(
      run(parseString({ type: "string", format: "date-time" }), datetime),
    ).toStrictEqual({ success: true, data: datetime });
  });

  it("should accept errorMessage", () => {
    expect(
      parseString({
        type: "string",
        format: "ipv4",
        pattern: "x",
        minLength: 1,
        maxLength: 2,
        errorMessage: {
          format: "ayy",
          pattern: "lmao",
          minLength: "deez",
          maxLength: "nuts",
        },
      }),
    ).toStrictEqual(
      'z.string().ip({ version: "v4", message: "ayy" }).regex(new RegExp("x"), "lmao").min(1, "deez").max(2, "nuts")',
    );
  });
});
