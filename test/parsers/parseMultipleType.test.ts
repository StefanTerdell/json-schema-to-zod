import { parseSchema } from "../../src/parsers/parseSchema";
import { suite } from "../suite";

suite("parseMultipleType", (test) => {
  test("should handle object with multitype properties with default", (assert) => {
    const schema = {
      type: "object",
      properties: {
        prop: {
          type: ["string", "null"],
          default: null,
        },
      },
    };
    assert(
      parseSchema(schema, { path: [], seen: new Map() }),
      `z.object({ "prop": z.union([z.string(), z.null()]).default(null) })`,
    );
  });
});
