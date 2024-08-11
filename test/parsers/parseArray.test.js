import { parseArray } from "../../src/parsers/parseArray";
import { suite } from "../suite";

suite("parseArray", (test) => {
  test("should create tuple with items array", (assert) => {
    assert(
      parseArray(
        {
          type: 'array',
          items: [
            {
              type: 'string'
            },
            {
              type: 'number'
            }
          ]
        },
        { path: [], seen: new Map() },
      ),
      "z.tuple([z.string(),z.number()])",
    );
  });

  test("should create array with items object", (assert) => {
    assert(
      parseArray(
        {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        { path: [], seen: new Map() },
      ),
      "z.array(z.string())",
    );
  });

  test("should create max for maxItems", (assert) => {
    assert(
      parseArray(
        {
          type: 'array',
          maxItems: 2,
          items: {
            type: 'string'
          }
        },
        { path: [], seen: new Map() },
      ),
      "z.array(z.string()).max(2)",
    );
  });
})
