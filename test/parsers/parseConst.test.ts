import { parseConst } from "../../src/parsers/parseConst";

describe("parseConst", () => {
  it("should handle falsy constants", () => {
    expect(
      parseConst({
        const: false,
      })
    ).toStrictEqual("z.literal(false)");
  });
});
