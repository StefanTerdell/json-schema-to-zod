import { JSONSchema7, JSONSchema7Type } from "json-schema";
import { ParseSchemaContext } from "./parseSchema";

export const parseEnum = (
  schema: JSONSchema7 & { enum: JSONSchema7Type[] | JSONSchema7Type },
  ctx: ParseSchemaContext
) => {
  const needNativeNum = !!schema.enum.find(item => typeof item === 'number' )
  if (needNativeNum && Array.isArray(schema.enum)) {
    const addType = `
const ${ctx.currentPropertyKey} = {
  ${schema.enum.map((item) => `NUMBER_${item}: ${item}`)},
} as const;\n\n`
    if (ctx.editingResult.slice(0, 6) === 'import') {
      ctx.editingResult = ctx.editingResult.replace(`import {z} from 'zod'\n\n`, `import {z} from 'zod'\n\n${addType}`)
    } else {
      ctx.editingResult = addType + ctx.editingResult
    }
    return `z.nativeEnum(${ctx.currentPropertyKey})`
  }
  return Array.isArray(schema.enum)
    ? `z.enum([${schema.enum.map((x: any) => JSON.stringify(x))}])`
    : `z.literal(${JSON.stringify(schema.enum)})`;
};
