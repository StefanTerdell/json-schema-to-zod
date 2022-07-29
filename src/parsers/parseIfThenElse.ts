import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { parseSchema, ParseSchemaContext } from "./parseSchema";

export const parseIfThenElse = (
  schema: JSONSchema7 & {
    if: JSONSchema7Definition;
    then: JSONSchema7Definition;
    else: JSONSchema7Definition;
  },
  ctx: ParseSchemaContext
): string => {
  const $if = parseSchema(schema.if, ctx);
  const $then = parseSchema(schema.then, ctx);
  const $else = parseSchema(schema.else, ctx);
  return `z.union([${$then},${$else}]).superRefine((value,ctx) => {
  const result = ${$if}.safeParse(value).success
    ? ${$then}.safeParse(value)
    : ${$else}.safeParse(value);
  if (!result.success) {
    result.error.errors.forEach((error) => ctx.addIssue(error))
  }
})`;
};
