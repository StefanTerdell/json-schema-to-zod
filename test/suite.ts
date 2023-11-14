import util from "util";
import diff from "fast-diff";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[39m";

type TestContext = (assert: (result: any, expected?: any) => void) => void;
type TestFunction = (name: string, context: TestContext) => void;
type SuiteContext = (test: TestFunction) => void;
type Error = { expected: any; got: any };
type ErrorMap = { [key: string]: Error | ErrorMap };

export function suite(suiteName: string, suiteContext: SuiteContext): void {
  let tests = 0;
  let passedTests = 0;

  const test: TestFunction = (testName, testContext) => {
    tests++;

    let assertions = 0;
    let passedAssertions = 0;
    try {
      testContext((...args) => {
        assertions++;

        const error =
          args.length === 2
            ? assert(args[0], args[1], [])
            : args[0]
            ? undefined
            : { expected: "truthy", got: args[0] };

        if (!error) {
          passedAssertions++;
        } else {
          let errorString =
            typeof error.got === "string" && typeof error.expected === "string"
              ? "\n" + colorDiff(error.got, error.expected)
              : util.inspect(error, { depth: null });

          if (!errorString.endsWith("\n")) {
            errorString += "\n";
          }

          console.error(
            `❌ '${suiteName}', '${testName}', assertion ${assertions} failed:`,
            errorString,
          );
        }
      });

      if (assertions === 0) {
        console.log(`⚠ '${suiteName}', '${testName}': No assertions found`);
      }

      if (assertions === passedAssertions) {
        passedTests++;
      }
    } catch (e) {
      console.error(
        `❌ '${suiteName}', '${testName}': Error thrown after ${assertions} ${
          assertions === 1 ? "assertion" : "assertions"
        }. Error:`,
        e,
      );
    }
  };

  suiteContext(test);
  if (tests === 0) {
    console.log(`⚠ '${suiteName}': No tests found`);
  } else if (tests === passedTests) {
    console.log(
      `✔ '${suiteName}': ${tests} ${tests === 1 ? "test" : "tests"} passed`,
    );
  } else {
    console.error(
      `❌ '${suiteName}': ${passedTests}/${tests} ${
        passedTests === 1 ? "test" : "tests"
      } passed`,
    );
    process.exitCode = 1;
  }
}

function assert(
  a: unknown,
  b: unknown,
  path: (string | number)[],
): Error | ErrorMap | undefined {
  if (a === b) {
    return undefined;
  }

  if (typeof a === "object") {
    if (typeof b !== "object") {
      return { expected: typeof a, got: typeof b };
    }

    if (a === null) {
      return { expected: null, got: b };
    }

    if (b === null) {
      return { expected: a, got: null };
    }

    if (Array.isArray(a)) {
      if (!Array.isArray(b)) {
        return { expected: "array", got: b };
      }
    } else if (Array.isArray(b)) {
      return { expected: a, got: "array" };
    }

    const keysA = Object.keys(a).sort();
    const keysB = Object.keys(b).sort();

    if (keysA.join() !== keysB.join()) {
      return { got: keysA, expected: keysB };
    }

    let foundError = false;

    const errorMap = [...keysA, ...keysB].reduce((errorMap: ErrorMap, key) => {
      if (key in errorMap) {
        return errorMap;
      }

      const error = assert(a[key], b[key], [...path, key]);

      if (error) {
        foundError = true;

        errorMap[key] = error;
      }

      return errorMap;
    }, {});

    if (foundError) {
      return errorMap;
    } else {
      return undefined;
    }
  }

  if (
    typeof a === "function" &&
    typeof b === "function" &&
    a.toString() === b.toString()
  ) {
    return undefined;
  }

  if (typeof a !== typeof b) {
    return { got: typeof a, expected: typeof b };
  }

  return { got: a, expected: b };
}

export function colorDiff(got: string, exp: string) {
  return diff(got, exp).reduce(
    (acc, [type, value]) =>
      acc + (type === -1 ? GREEN : type === 1 ? RED : RESET) + value,
    "",
  );
}
