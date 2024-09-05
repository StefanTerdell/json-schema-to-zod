import { parseArgs, printParams } from "../../src/utils/cliTools";
import { suite } from "../suite";

suite("cliTools", (test) => {
  test("parseArgs should handle param as optional whether false or undefined is passed", (assert) => {
    assert(parseArgs({ test: { required: false } }, []));
    assert(parseArgs({ test: { required: undefined } }, []));
  });

  test("parseArgs should throw with missing required property", (assert) => {
    let caught = false;
    try {
      parseArgs({ test: { required: true } }, []);
    } catch {
      caught = true;
    }
    assert(caught);
  });

  test("parseArgs should throw with missing required property with message", (assert) => {
    let caught = false;
    try {
      parseArgs({ test: { required: "Some message" } }, []);
    } catch {
      caught = true;
    }
    assert(caught);
  });

  test("printParams should handle missing description", (assert) => {
    const log = console.log;
    let logged = false;
    console.log = () => {
      logged = true;
    };

    printParams({ test: { } });
    assert(logged);
    console.log = log;
  });

  test("parseArgs should handle help with argument passed", (assert) => {
    let ran = false;
    let logged = false;

    const exit = process.exit;
    const log = console.log;

    // @ts-expect-error Unit testing
    process.exit = () => {
      ran = true;
    };
    console.log = () => {
      logged = true;
    };
    parseArgs({ }, ['-h'], true);
    parseArgs({ }, ['--help'], true);
    parseArgs({ }, ['--help'], "some help string");
    assert(ran);
    assert(logged);
    process.exit = exit;
    console.log = log;
  });
});
