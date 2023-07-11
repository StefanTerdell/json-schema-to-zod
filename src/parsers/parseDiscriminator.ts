import { JSONSchema7Definition } from "json-schema";
import { JSONSchema7Extended, Refs } from "../Types";
import { parseSchema } from "./parseSchema";
import { parseOneOf } from "./parseOneOf";

export const parseDiscriminator = (
  schema: JSONSchema7Extended & { oneOf: JSONSchema7Definition[] },
  refs: Refs
) => {
  if (schema.oneOf.length <= 1 || !schema.discriminator?.propertyName) {
    return parseOneOf(schema, refs);
  }

  const schemas = schema.oneOf.map((schema, i) =>
    parseSchema(schema, {
      ...refs,
      path: [...refs.path, "oneOf", i],
    })
  );

  return `z.discriminatedUnion("${
    schema.discriminator?.propertyName
  }", [${schemas.join(", ")}])`;
};
