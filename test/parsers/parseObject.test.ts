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
          false
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
          false
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
          false
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
          false
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
          false
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
          false
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
          false
        )
      ).toStrictEqual("z.record(z.number())");
    });

    it("should include falsy defaults", () => {
      expect(
        parseObject({
          type: "object",
          properties: {
            s: {
              type: "string",
              default: "",
            },
          },
        })
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
        false
      )
    ).toStrictEqual(
      'z.object({"a":z.string()}).and(z.union([z.object({"b":z.string()}),z.object({"c":z.string()})]))'
    );
  });
});
