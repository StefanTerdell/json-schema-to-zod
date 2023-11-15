import { jsonSchemaToZod } from "../src/jsonSchemaToZod.js";
import { suite } from "./suite";

suite("eval", (test) => {
  test("is usable I guess", (assert) => {
    const zodSchema = eval(
      jsonSchemaToZod({ type: "string" }, { module: "cjs" }),
    );

    assert(zodSchema.safeParse("Please just use Ajv instead"), {
      success: true,
      data: "Please just use Ajv instead",
    });
  });
});
