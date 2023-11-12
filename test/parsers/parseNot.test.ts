import { parseNot } from "../../src/parsers/parseNot";

describe("parseNot", () => {
  it("", () => {
    expect(
      parseNot(
        {
          not: {
            type: "string",
          },
        },
        { module: false, path: [], seen: new Map() },
      ),
    ).toStrictEqual(
      'z.any().refine((value) => !z.string().safeParse(value).success, "Invalid input: Should NOT be valid against schema")',
    );
  });
});
