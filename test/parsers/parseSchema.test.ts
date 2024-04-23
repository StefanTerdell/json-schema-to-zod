import { parseSchema } from "../../src/parsers/parseSchema.js";
import { suite } from "../suite";

suite("parseSchema", (test) => {
  test("should be usable without providing refs", (assert) => {
    assert(parseSchema({ type: "string" }), "z.string()");
  });

  test("should be possible to describe a readonly schema", (assert) => {
    assert(
      parseSchema({ type: "string", readOnly: true }),
      "z.string().readonly()",
    );
  });
});
