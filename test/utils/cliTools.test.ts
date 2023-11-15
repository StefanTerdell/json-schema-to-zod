import { parseArgs } from "../../src/utils/cliTools";
import { suite } from "../suite";

suite("cliTools", (test) => {
  test("parseArgs should handle param as optional wether false or undefined is passed", (assert) => {
    assert(parseArgs({ test: { required: false } }, []));
    assert(parseArgs({ test: { required: undefined } }, []));
  });
});
