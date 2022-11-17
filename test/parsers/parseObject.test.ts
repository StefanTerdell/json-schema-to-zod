import { parseObject } from "../../src/parsers/parseObject";

describe("parseObject", () => {
  describe("With properties", () => {
    it("should handle optional and required properties", () => {
      expect(
        parseObject({
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
        })
      ).toStrictEqual(
        'z.object({"myOptionalString":z.string().optional(),"myRequiredString":z.string()})'
      );
    });

    it("should handle additionalProperties when set to false", () => {
      expect(
        parseObject({
          type: "object",
          required: ["myString"],
          properties: {
            myString: {
              type: "string",
            },
          },
          additionalProperties: false,
        })
      ).toStrictEqual('z.object({"myString":z.string()}).strict()');
    });

    it("should handle additionalProperties when set to true", () => {
      expect(
        parseObject({
          type: "object",
          required: ["myString"],
          properties: {
            myString: {
              type: "string",
            },
          },
          additionalProperties: true,
        })
      ).toStrictEqual('z.object({"myString":z.string()}).catchall(z.any())');
    });

    it("should handle additionalProperties when provided a schema", () => {
      expect(
        parseObject({
          type: "object",
          required: ["myString"],
          properties: {
            myString: {
              type: "string",
            },
          },
          additionalProperties: { type: "number" },
        })
      ).toStrictEqual('z.object({"myString":z.string()}).catchall(z.number())');
    });
  });

  describe("Without properties", () => {
    it("should handle additionalProperties when set to false", () => {
      expect(
        parseObject({
          type: "object",
          additionalProperties: false,
        })
      ).toStrictEqual("z.object({}).strict()");
    });

    it("should handle additionalProperties when set to true", () => {
      expect(
        parseObject({
          type: "object",
          additionalProperties: true,
        })
      ).toStrictEqual("z.record(z.any())");
    });

    it("should handle additionalProperties when provided a schema", () => {
      expect(
        parseObject({
          type: "object",
          additionalProperties: { type: "number" },
        })
      ).toStrictEqual("z.record(z.number())");
    });
  });
});
