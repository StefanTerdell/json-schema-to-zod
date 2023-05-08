import { parseObject } from "../../src/parsers/parseObject";

describe("parseObject", () => {
  describe("With properties", () => {
    it("should handle optional and required properties", () => {
      expect(
        parseObject(
          {
            type: "object",
            required: ["myRequiredString"],
            properties: {
              myOptionalString: {
                type: "string",
              },
              myRequiredString: {
                type: "string",
              },
            },
          },
          { module: false, path: [] }
        )
      ).toStrictEqual(
        'z.object({"myOptionalString":z.string().optional(),"myRequiredString":z.string()})'
      );
    });

    it("should handle additionalProperties when set to false", () => {
      expect(
        parseObject(
          {
            type: "object",
            required: ["myString"],
            properties: {
              myString: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          { module: false, path: [] }
        )
      ).toStrictEqual('z.object({"myString":z.string()}).strict()');
    });

    it("should handle additionalProperties when set to true", () => {
      expect(
        parseObject(
          {
            type: "object",
            required: ["myString"],
            properties: {
              myString: {
                type: "string",
              },
            },
            additionalProperties: true,
          },
          { module: false, path: [] }
        )
      ).toStrictEqual('z.object({"myString":z.string()}).catchall(z.any())');
    });

    it("should handle additionalProperties when provided a schema", () => {
      expect(
        parseObject(
          {
            type: "object",
            required: ["myString"],
            properties: {
              myString: {
                type: "string",
              },
            },
            additionalProperties: { type: "number" },
          },
          { module: false, path: [] }
        )
      ).toStrictEqual('z.object({"myString":z.string()}).catchall(z.number())');
    });
  });

  describe("Without properties", () => {
    it("should handle additionalProperties when set to false", () => {
      expect(
        parseObject(
          {
            type: "object",
            additionalProperties: false,
          },
          { module: false, path: [] }
        )
      ).toStrictEqual("z.object({}).strict()");
    });

    it("should handle additionalProperties when set to true", () => {
      expect(
        parseObject(
          {
            type: "object",
            additionalProperties: true,
          },
          { module: false, path: [] }
        )
      ).toStrictEqual("z.record(z.any())");
    });

    it("should handle additionalProperties when provided a schema", () => {
      expect(
        parseObject(
          {
            type: "object",
            additionalProperties: { type: "number" },
          },

          { module: false, path: [] }
        )
      ).toStrictEqual("z.record(z.number())");
    });

    it("should include falsy defaults", () => {
      expect(
        parseObject(
          {
            type: "object",
            properties: {
              s: {
                type: "string",
                default: "",
              },
            },
          },
          { module: false, path: [] }
        )
      ).toStrictEqual(`z.object({"s":z.string().default("")})`);
    });
  });

  describe("with nested unions", () => {
    expect(
      parseObject(
        {
          type: "object",
          required: ["a"],
          properties: {
            a: {
              type: "string",
            },
          },
          anyOf: [
            {
              required: ["b"],
              properties: {
                b: {
                  type: "string",
                },
              },
            },
            {
              required: ["c"],
              properties: {
                c: {
                  type: "string",
                },
              },
            },
          ],
        },
        { module: false, path: [] }
      )
    ).toStrictEqual(
      'z.object({"a":z.string()}).and(z.union([z.object({"b":z.string()}),z.object({"c":z.string()})]))'
    );
  });
});
