import jsonSchemaToZod from "../src";

describe("eval", () => {
  it("is usable I guess", () => {
    const zodSchema = eval(
      jsonSchemaToZod({ type: "string" }, { module: "cjs" }),
    );

    expect(zodSchema.safeParse("Please just use Ajv instead")).toStrictEqual({
      success: true,
      data: "Please just use Ajv instead",
    });
  });
});
