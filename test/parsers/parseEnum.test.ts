import { parseEnum } from "../../src/parsers/parseEnum";
import { suite } from "../suite";

suite("parseEnum", (test) => {
  test("should create never with empty enum", (assert) => {
    assert(
      parseEnum(
        {
          enum: []
        },
      ),
      "z.never()",
    );
  });

  test("should create literal with single item enum", (assert) => {
    assert(
      parseEnum(
        {
          enum: ["someValue"]
        },
      ),
      `z.literal("someValue")`,
    );
  });

  test("should create enum array with string enums", (assert) => {
    assert(
      parseEnum(
        {
          enum: ["someValue", "anotherValue"]
        },
      ),
      `z.enum(["someValue","anotherValue"])`,
    );
  });
  test("should create union with mixed enums", (assert) => {
    assert(
      parseEnum(
        {
          enum: ["someValue", 57]
        },
      ),
      `z.union([z.literal("someValue"), z.literal(57)])`,
    );
  });
});
