import { parseSimpleDiscriminatedOneOf } from "../../src/parsers/parseSimpleDiscriminatedOneOf.js";
import { its } from "../../src/parsers/parseSchema.js";
import { JsonSchemaObject } from "../../src/Types.js";
import { suite } from "../suite";

suite("parseSimpleDiscriminatedOneOf", (test) => {
  test("should create a discriminated union from two or more object schemas", (assert) => {
    assert(
      parseSimpleDiscriminatedOneOf(
        {
          discriminator: {
            propertyName: "objectType"
          },
          oneOf: [
            {
              type: "object",
              properties: {
                objectType: { type: "string", enum: ["typeA"] },
              },
              required: ["objectType"],
            },
            {
              type: "object",
              properties: {
                objectType: { type: "string", enum: ["typeB"] },
              },
              required: ["objectType"],
            },
          ],
        },
        { path: [], seen: new Map() },
      ),
      'z.discriminatedUnion("objectType", [z.object({ "objectType": z.literal("typeA") }), z.object({ "objectType": z.literal("typeB") })])',
    );
  });

  test("should extract a single schema", (assert) => {
    assert(
      parseSimpleDiscriminatedOneOf(
        {
          discriminator: {
            propertyName: "objectType"
          },
          oneOf: [
            {
              type: "object",
              properties: {
                objectType: { type: "string", enum: ["typeA"] },
              },
              required: ["objectType"],
            },
          ],
        },
        { path: [], seen: new Map() },
      ),
      'z.object({ "objectType": z.literal("typeA") })',
    );
  });

  test("should return z.any() if array is empty", (assert) => {
    assert(parseSimpleDiscriminatedOneOf(
      {
        oneOf: [],
        discriminator: {
          propertyName: "objectType"
        },
      },
      { path: [], seen: new Map() },
    ), "z.any()");
  });

  test("should handle discriminator with const values", (assert) => {
    assert(
      parseSimpleDiscriminatedOneOf(
        {
          discriminator: {
            propertyName: "kind"
          },
          oneOf: [
            {
              type: "object",
              properties: {
                kind: { type: "string", const: "person" },
                name: { type: "string" },
              },
              required: ["kind", "name"],
            },
            {
              type: "object",
              properties: {
                kind: { type: "string", const: "company" },
                companyName: { type: "string" },
              },
              required: ["kind", "companyName"],
            },
          ],
        },
        { path: [], seen: new Map() },
      ),
      'z.discriminatedUnion("kind", [z.object({ "kind": z.literal("person"), "name": z.string() }), z.object({ "kind": z.literal("company"), "companyName": z.string() })])',
    );
  });

  // Type guard tests
  test("type guard should accept valid discriminated union with const values", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object" as const,
          properties: {
            type: { type: "string" as const, const: "A" },
            value: { type: "string" as const }
          },
          required: ["type", "value"]
        },
        {
          type: "object" as const, 
          properties: {
            type: { type: "string" as const, const: "B" },
            count: { type: "number" as const }
          },
          required: ["type", "count"]
        }
      ],
      discriminator: {
        propertyName: "type"
      }
    } as JsonSchemaObject;
    assert(its.a.simpleDiscriminatedOneOf(schema), true);
  });

  test("type guard should accept valid discriminated union with single-value enum", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object",
          properties: {
            kind: { type: "string", enum: ["person"] },
            name: { type: "string" }
          },
          required: ["kind", "name"]
        }
      ],
      discriminator: {
        propertyName: "kind"
      }
    };
    assert(its.a.simpleDiscriminatedOneOf(schema), true);
  });

  test("type guard should reject numeric discriminator", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object",
          properties: {
            version: { type: "number", const: 1 },
            data: { type: "string" }
          }
        }
      ],
      discriminator: {
        propertyName: "version"
      }
    };
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject schema without oneOf", (assert) => {
    const schema = {
      discriminator: {
        propertyName: "type"
      }
    };
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject schema without discriminator", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object",
          properties: {
            type: { type: "string", const: "A" }
          }
        }
      ]
    };
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject schema with empty oneOf array", (assert) => {
    const schema = {
      oneOf: [],
      discriminator: {
        propertyName: "type"
      }
    };
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject discriminator without propertyName", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object",
          properties: {
            type: { type: "string", const: "A" }
          }
        }
      ],
      discriminator: {}
    };
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject discriminator with non-string propertyName", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object",
          properties: {
            type: { type: "string", const: "A" }
          }
        }
      ],
      discriminator: {
        propertyName: 123
      }
    };
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject oneOf with non-object schemas", (assert) => {
    const schema = {
      oneOf: [
        { type: "string" },
        {
          type: "object",
          properties: {
            type: { type: "string", const: "A" }
          }
        }
      ],
      discriminator: {
        propertyName: "type"
      }
    };
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject oneOf items missing discriminator property", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object",
          properties: {
            value: { type: "string" }
          }
        }
      ],
      discriminator: {
        propertyName: "type"
      }
    };
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject discriminator property without const or single-value enum", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object",
          properties: {
            type: { type: "string" } // No const or enum
          }
        }
      ],
      discriminator: {
        propertyName: "type"
      }
    };
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject discriminator property with multi-value enum", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object",
          properties: {
            type: { type: "string", enum: ["A", "B"] } // Multi-value enum
          }
        }
      ],
      discriminator: {
        propertyName: "type"
      }
    };
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject oneOf items without properties", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object"
          // No properties
        }
      ],
      discriminator: {
        propertyName: "type"
      }
    };
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject discriminator property with unsupported type", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object",
          properties: {
            type: { type: "boolean", const: true } // Boolean not supported
          }
        }
      ],
      discriminator: {
        propertyName: "type"
      }
    };
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject null/undefined oneOf", (assert) => {
    const schema1 = {
      oneOf: null,
      discriminator: {
        propertyName: "type"
      }
    } as any; // Using any for invalid test data
    const schema2 = {
      oneOf: undefined,
      discriminator: {
        propertyName: "type"
      }
    } as any; // Using any for invalid test data
    assert(its.a.simpleDiscriminatedOneOf(schema1), false);
    assert(its.a.simpleDiscriminatedOneOf(schema2), false);
  });

  test("type guard should reject discriminator not in required array", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object",
          properties: {
            type: { type: "string", const: "A" },
            value: { type: "string" }
          },
          required: ["value"] // missing "type" in required
        }
      ],
      discriminator: {
        propertyName: "type"
      }
    } as JsonSchemaObject;
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject schemas without required array", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object",
          properties: {
            type: { type: "string", const: "A" },
            value: { type: "string" }
          }
          // No required array at all
        }
      ],
      discriminator: {
        propertyName: "type"
      }
    } as JsonSchemaObject;
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should reject schemas with non-array required", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object",
          properties: {
            type: { type: "string", const: "A" },
            value: { type: "string" }
          },
          required: true // boolean instead of array
        }
      ],
      discriminator: {
        propertyName: "type"
      }
    } as any; // Using any for invalid test data
    assert(its.a.simpleDiscriminatedOneOf(schema), false);
  });

  test("type guard should accept discriminator in required array", (assert) => {
    const schema = {
      oneOf: [
        {
          type: "object",
          properties: {
            type: { type: "string", const: "A" },
            value: { type: "string" }
          },
          required: ["type", "value"] // "type" is properly required
        }
      ],
      discriminator: {
        propertyName: "type"
      }
    } as JsonSchemaObject;
    assert(its.a.simpleDiscriminatedOneOf(schema), true);
  });
});
