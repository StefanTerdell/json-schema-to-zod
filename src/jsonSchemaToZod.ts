import { JSONSchema7 } from "json-schema";
import { parseSchema } from "./parsers/parseSchema";
import { format } from "./utils/format";
import $RefParser from "@apidevtools/json-schema-ref-parser";

export const jsonSchemaToZodDereffed = (
  schema: JSONSchema7,
  name?: string,
  module = true
): Promise<string> =>
  $RefParser
    .dereference(schema)
    .then((schema) => jsonSchemaToZod(schema as JSONSchema7, name, module));

export const jsonSchemaToZod = (
  schema: JSONSchema7,
  name?: string,
  module = true
): string => {
  
  const ctx = {
    editingResult: `${module ? `import {z} from 'zod'\n\nexport ` : ""}${
      name ? `const ${name}=` : module ? "default " : "const schema="
    }`
  }
  const result = parseSchema(schema, ctx)
  return format(ctx.editingResult + result);
}
