import { parseString } from "../../src/parsers/parseString";
import { suite } from "../suite";

suite("parseString", (test) => {
  const run = (output: string, data: unknown) =>
    eval(
      `const {z} = require("zod"); ${output}.safeParse(${JSON.stringify(
        data,
      )})`,
    );

  test("DateTime format", (assert) => {
    const datetime = "2018-11-13T20:20:39Z";

    assert(
      run(parseString({ type: "string", format: "date-time" }), datetime),
      { success: true, data: datetime },
    );
  });

  test("should accept errorMessage", (assert) => {
    assert(
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
      'z.string().ip({ version: "v4", message: "ayy" }).regex(new RegExp("x"), "lmao").min(1, "deez").max(2, "nuts")',
    );
  });
});
