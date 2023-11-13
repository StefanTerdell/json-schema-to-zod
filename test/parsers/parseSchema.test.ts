import { parseSchema } from "../../src";
import { suite } from "../suite";

suite("parseSchema", (test) => {
  test("should be usable without providing refs", (assert) => {
    assert(parseSchema({ type: "string" }), "z.string()");
  });
});
