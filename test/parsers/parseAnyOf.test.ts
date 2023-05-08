import { parseAnyOf } from "../../src/parsers/parseAnyOf";
import { Refs } from "../../src/Types";

describe("parseAnyOf", () => {
  it("should create a union from two or more schemas", () => {
    expect(
      parseAnyOf(
        {
          anyOf: [
            {
              type: "string",
            },
            { type: "number" },
          ],
        },
        { module: false, path: [] }
      )
    ).toStrictEqual("z.union([z.string(),z.number()])");
  });

  it("should extract a single schema", () => {
    expect(
      parseAnyOf({ anyOf: [{ type: "string" }] }, { module: false, path: [] })
    ).toStrictEqual("z.string()");
  });

  it("should return z.any() if array is empty", () => {
    expect(
      parseAnyOf({ anyOf: [] }, { module: false, path: [] })
    ).toStrictEqual("z.any()");
  });
});
