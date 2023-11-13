function assert(
  a: unknown,
  b: unknown,
  path: (string | number)[],
): { expected: any; got: any; path: (string | number)[] }[] {
  if (typeof a === "object") {
    if (typeof b !== "object") {
      return [{ expected: typeof a, got: typeof b, path }];
    }

    if (a === null) {
      return [{ expected: null, got: b, path }];
    }

    if (b === null) {
      return [{ expected: a, got: null, path }];
    }

    if (Array.isArray(a)) {
      if (!Array.isArray(b)) {
        return [{ expected: "array", got: b, path }];
      }
    } else if (Array.isArray(b)) {
      return [{ expected: a, got: "array", path }];
    }

    const keysA = Object.keys(a).sort();
    const keysB = Object.keys(b).sort();

    if (keysA.join() !== keysB.join()) {
      return [{ expected: keysA, got: keysB, path }];
    }

    return keysA.flatMap((key) => assert(a[key], b[key], [...path, key]));
  }

  return a !== b ? [{ expected: a, got: b, path }] : [];
}

type TestContext = (assert: (result: any, expected: any) => void) => void;
type TestFunction = (name: string, context: TestContext) => void;
type SuiteContext = (test: TestFunction) => void;

export function suite(suiteName: string, suiteContext: SuiteContext): void {
  console.log("Suite", suiteName);

  let tests = 0;
  let passedTests = 0;

  const test: TestFunction = (testName, testContext) => {
    console.log("Test", testName);
    tests++;

    let assertions = 0;
    let passedAssertions = 0;

    testContext((result, expected) => {
      assertions++;
      const errors = assert(result, expected, []);

      if (!errors.length) {
        passedAssertions++;
        console.log(assertions, "✔");
      } else {
        console.error(assertions, "❌", errors);
      }
    });

    if (assertions === passedAssertions) {
      passedTests++;
    }
  };

  suiteContext(test);

  if (tests === passedTests) {
    console.log("Hooray");
  } else {
    process.exit(1);
  }
}

// Example usage
suite("Basic Math Tests", (test) => {
  test("Adding 1 + 1", (assert) => {
    const result = 1 + 1;
    const expected = 2;

    assert(result, expected);
  });

  // Add more tests here
});
