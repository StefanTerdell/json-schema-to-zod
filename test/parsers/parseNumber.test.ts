import { parseNumber } from "../../src/parsers/parseNumber";
import { suite } from "../suite";

suite("parseNumber", (test) => {
  test("should accept errorMessage", (assert) => {
    assert(
      parseNumber({
        type: "number",
        format: "int64",
        exclusiveMinimum: 0,
        maximum: 2,
        multipleOf: 2,
        errorMessage: {
          format: "ayy",
          multipleOf: "lmao",
          exclusiveMinimum: "deez",
          maximum: "nuts",
        },
      }),

      'z.number().int("ayy").multipleOf(2, "lmao").gt(0, "deez").lte(2, "nuts")',
    );
  });
});
