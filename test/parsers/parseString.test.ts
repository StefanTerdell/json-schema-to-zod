import { parseString } from "../../src/parsers/parseString"

describe("parseString", () => {
  const run = (output: string, data: unknown) =>
    eval(
      `const {z} = require("zod"); ${output}.safeParse(${JSON.stringify(
        data,
      )})`,
    )

  test("DateTime format", () => {
    const datetime = "2018-11-13T20:20:39Z"

    expect(
      run(
        parseString({ type: "string", format: "date-time" }),
        datetime,
      ),
    ).toStrictEqual({ success: true, data: datetime })
  })
})
