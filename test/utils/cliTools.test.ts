import { parseArgs } from "../../src/utils/cliTools";
import { suite } from "../suite";

suite("cliTools", (test) => {
  test("parseArgs should handle param as optional whether false or undefined is passed", (assert) => {
    assert(parseArgs({ test: { required: false } }, []));
    assert(parseArgs({ test: { required: undefined } }, []));
  });

  test("parseArgs should handle help with argument passed", (assert) => {
    assert(parseArgs({ }, ['-h'], true));
    assert(parseArgs({ }, ['--help'], true));
  });
});
