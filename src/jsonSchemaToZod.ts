import { JSONSchema7 } from "json-schema";
import { parseSchema } from "./parsers/parseSchema";
import { format } from "./utils/format";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { Options } from "./Types";

export const jsonSchemaToZodDereffed = (
  schema: JSONSchema7,
  options?: Options
): Promise<string> => {
  return $RefParser
    .dereference(schema)
    .then((schema) => jsonSchemaToZod(schema as JSONSchema7, options));
};
export const jsonSchemaToZod = (
  schema: JSONSchema7,
  { module = true, name, ...rest }: Options = {}
): string => {
  return format(
    `${module ? `import {z} from 'zod'\n\nexport ` : ""}${
      name ? `const ${name}=` : module ? "default " : "const schema="
    }${parseSchema(schema, { module, name, ...rest, path: [] })}`
  );
};
