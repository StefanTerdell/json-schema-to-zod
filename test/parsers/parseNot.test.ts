import { parseNot } from "../../src/parsers/parseNot";
import { suite } from "../suite";

suite("parseNot", (test) => {
  test("", (assert) => {
    assert(
      parseNot(
        {
          not: {
            type: "string",
          },
        },
        { module: false, path: [], seen: new Map() },
      ),
      'z.any().refine((value) => !z.string().safeParse(value).success, "Invalid input: Should NOT be valid against schema")',
    );
  });
});
