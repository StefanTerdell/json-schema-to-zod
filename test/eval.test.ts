import { jsonSchemaToZod } from "../src/jsonSchemaToZod.js";
import ts from "typescript";
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

  test("oneOf accepts input when exactly one schema passes", (assert) => {
    const generated = jsonSchemaToZod(
      {
        oneOf: [
          {
            type: "object",
            properties: {
              a: { type: "string" },
            },
            required: ["a"],
          },
          {
            type: "object",
            properties: {
              b: { type: "number" },
              c: { type: "boolean" },
            },
            required: ["b", "c"],
          },
        ],
      },
      { module: "cjs" },
    );
    const zodSchema = eval(
      ts.transpileModule(generated, {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2020,
        },
      }).outputText,
    );

    assert(zodSchema.safeParse({ a: "ok" }), {
      success: true,
      data: { a: "ok" },
    });
  });
});
