import { parseAnyOf } from "../../src/parsers/parseAnyOf";
import { suite } from "../suite";

suite("parseAnyOf", (test) => {
  test("should create a union from two or more schemas", (assert) => {
    assert(
      parseAnyOf(
        {
          anyOf: [
            {
              type: "string",
            },
            { type: "number" },
          ],
        },
        { module: false, path: [], seen: new Map() },
      ),
      "z.union([z.string(), z.number()])",
    );
  });

  test("should extract a single schema", (assert) => {
    assert(
      parseAnyOf(
        { anyOf: [{ type: "string" }] },
        { module: false, path: [], seen: new Map() },
      ),
      "z.string()",
    );
  });

  test("should return z.any() if array is empty", (assert) => {
    assert(
      parseAnyOf({ anyOf: [] }, { module: false, path: [], seen: new Map() }),
      "z.any()",
    );
  });
});
