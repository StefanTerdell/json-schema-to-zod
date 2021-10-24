import { parseSchema } from "../parseSchema";

export const parseIfThenElse = (schema: any): string => {
  const $if = parseSchema(schema.if);
  const $then = parseSchema(schema.then);
  const $else = parseSchema(schema.else);
  return `z.union([${$then},${$else}]).superRefine((value,ctx) => {
  const result = ${$if}.safeParse(value).success
    ? ${$then}.safeParse(value)
    : ${$else}.safeParse(value);
  if (!result.success) {
    result.error.errors.forEach((error) => ctx.addIssue(error))
  }
})`;
};
