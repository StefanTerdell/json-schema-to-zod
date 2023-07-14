import { parseSchema } from "../../src";

describe("parseSchema", () => {
  it("should be usable without providing refs", () => {
    expect(parseSchema({ type: "string" })).toStrictEqual("z.string()");
  });
});
