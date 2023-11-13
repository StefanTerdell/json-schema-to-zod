type TestContext = (assert: (result: any, expected?: any) => void) => void;
type TestFunction = (name: string, context: TestContext) => void;
type SuiteContext = (test: TestFunction) => void;
type Error = { expected: any; got: any };
type ErrorMap = { [key: string]: Error | ErrorMap };

const VERBOSE = false;

export function suite(suiteName: string, suiteContext: SuiteContext): void {
  VERBOSE && console.log(`Suite "${suiteName}"`);

  let tests = 0;
  let passedTests = 0;

  const test: TestFunction = (testName, testContext) => {
    VERBOSE && console.log(` Test "${testName}"`);
    tests++;

    let assertions = 0;
    let passedAssertions = 0;

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
        VERBOSE && console.log("   ", assertions, "✔");
      } else {
        VERBOSE
          ? console.error("   ", assertions, "❌")
          : console.error("❌", suiteName, testName, assertions);

        console.dir(error, { depth: null });
      }
    });

    if (assertions === passedAssertions) {
      passedTests++;
    }
  };

  suiteContext(test);

  if (tests === passedTests) {
    VERBOSE && console.log("Hooray!");
  } else {
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
      return { expected: keysA, got: keysB };
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

  if (typeof a !== typeof b) {
    return { expected: typeof a, got: typeof b };
  }

  if (
    typeof a === "function" &&
    typeof b === "function" &&
    a.toString() === b.toString()
  ) {
    return undefined;
  }

  return { expected: a, got: b };
}
