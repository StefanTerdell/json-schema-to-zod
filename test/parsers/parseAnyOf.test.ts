import { parseAnyOf } from "../../src/parsers/parseAnyOf";

describe("parseAnyOf", () => {
  it("should create a union from two or more schemas", () => {
    expect(
      parseAnyOf({
        anyOf: [
          {
            type: "string",
          },
          { type: "number" },
        ],
      })
    ).toStrictEqual("z.union([z.string(),z.number()])");
  });

  it("should extract a single schema", () => {
    expect(parseAnyOf({ anyOf: [{ type: "string" }] })).toStrictEqual(
      "z.string()"
    );
  });

  it("should return z.any() if array is empty", () => {
    expect(parseAnyOf({ anyOf: [] })).toStrictEqual("z.any()");
  });
});
